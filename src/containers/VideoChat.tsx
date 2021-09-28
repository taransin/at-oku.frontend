import { useCallback, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Drawer, List, ListItem, ListItemText, CssBaseline, Paper } from '@mui/material'
import { useStore } from '../store/Store'
import { Person } from '@mui/icons-material';
import styled from 'styled-components';
import useSocket from '../hooks/useSocket';

const drawerWidth = 240;

const MainVideo = styled.video`
  height: 100%;
  width: 100%;
`

function VideoChat() {
  const videoPlayer = useRef(null);
  const remoteVideoPlayer = useRef(null);
  const [store] = useStore()
  const [callUser] = useSocket(remoteVideoPlayer);

  useEffect(() => {
    if (remoteVideoPlayer && store.peerConnection) {
      store.peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideoPlayer.current.srcObject = stream;
      };
    }
  }, [remoteVideoPlayer, store.peerConnection])

  const setVideoStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
       videoPlayer.current.srcObject = stream;
    } catch (error) {
      console.warn(error.message);
    }
  }, [videoPlayer])

  useEffect(() => {
    if (videoPlayer && videoPlayer.current) {
      setVideoStream();
    }
  }, [videoPlayer, setVideoStream])

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              VIDEO CHAT APP
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <Typography variant="h5">Online users:</Typography>
            <List>
              {store.users.map((user, index) => (
                <ListItem button key={user.id} onClick={() => callUser(user.id)} >
                  <Person />
                  <ListItemText primary={user.username} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container style={{position: 'relative'}}>
            <MainVideo autoPlay muted ref={remoteVideoPlayer} >
              
            </MainVideo>
            <Box sx={{width: 220, height: 200, position: 'absolute', right: 0, bottom: 0}}>
              <Paper elevation={5}>
                <video autoPlay muted ref={videoPlayer} style={{height: '100%', width: '100%', padding: 5}} />
              </Paper>
            </Box>
          </Container>
        </Box>
      </Box>
      
    </div>
  );
}

export default VideoChat;
