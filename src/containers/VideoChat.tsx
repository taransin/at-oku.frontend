import { useCallback, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Paper,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import styled from 'styled-components';
import useSocket from '../hooks/useSocket';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { useLocalization } from '@fluent/react';
import { Rnd } from 'react-rnd';

const drawerWidth = 240;

const MainVideo = styled.video`
  height: 100%;
  width: 100%;
`;

function VideoChat() {
  const { l10n } = useLocalization();
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const remoteVideoPlayer = useRef<HTMLVideoElement>(null);

  const [callUser] = useSocket(remoteVideoPlayer);

  const [peerConnection, users] = useSelector((state: RootState) => [
    state.application.peerConnection,
    state.application.users,
  ]);

  useEffect(() => {
    if (remoteVideoPlayer && peerConnection) {
      peerConnection.ontrack = ({ streams: [stream] }) => {
        const current = remoteVideoPlayer.current;
        if (current) {
          current.srcObject = stream;
        }
      };
    }
  }, [remoteVideoPlayer, peerConnection]);

  const setVideoStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const current = videoPlayer.current;
      if (current) {
        current.srcObject = stream;
      }
    } catch (error: any) {
      console.warn(error.message);
    }
  }, [videoPlayer]);

  useEffect(() => {
    if (videoPlayer && videoPlayer.current) {
      setVideoStream();
    }
  }, [videoPlayer, setVideoStream]);

  return (
    <div className="App">
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              @OKU
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            marginTop: '64px',
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', padding: '15px' }}>
            <Typography variant="h5">
              {l10n.getString('online-users')}:
            </Typography>
            <List>
              {users.map((user, key) => (
                <ListItem button key={key} onClick={() => callUser(user.id)}>
                  <Person />
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
          }}
        >
          <Toolbar />
          <Container
            style={{
              position: 'relative',
              display: 'flex',
              flexGrow: 1,
              margin: '0',
              width: '100%',
              maxWidth: '100%',
              background: '#111',
            }}
          >
            <MainVideo autoPlay muted ref={remoteVideoPlayer} />
            <Rnd
              default={{
                x: 150,
                y: 205,
                width: 220,
                height: 220,
              }}
              minWidth={128}
              minHeight={128}
              bounds="parent"
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                }}
              >
                <Paper elevation={5}>
                  <video
                    autoPlay
                    muted
                    ref={videoPlayer}
                    style={{ height: '100%', width: '100%', padding: 5 }}
                  />
                </Paper>
              </Box>
            </Rnd>
          </Container>
        </Box>
      </Box>
    </div>
  );
}

export default VideoChat;
