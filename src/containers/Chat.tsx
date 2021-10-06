import { useCallback, useContext, useEffect, useRef } from 'react';
import useSocket from '../hooks/useSocket';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { useLocalization } from '@fluent/react';
import { Rnd } from 'react-rnd';
import { SocketContext } from 'src/providers/SocketProvider';
import styled from 'styled-components';

const StyledChat = styled.div({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
});
const StyledMainVideo = styled.video(
  {
    height: '100%',
    width: '100%',
  },
  ({ theme }) => ({
    background: theme.colors.shade,
  }),
);

function Chat() {
  const { l10n } = useLocalization();
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const remoteVideoPlayer = useRef<HTMLVideoElement>(null);

  const [users] = useSelector((state: RootState) => [state.application.users]);
  const { peerConnection, socket } = useContext(SocketContext);
  const [callUser] = useSocket(remoteVideoPlayer, peerConnection, socket);

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
    <StyledChat>
      <div>
        <div>
          <h6>@OKU</h6>
        </div>
      </div>
      <div>
        <div>
          <h5>{l10n.getString('online-users')}:</h5>
          <ul>
            {users.map((user, key) => (
              <li key={key} onClick={() => callUser(user.id)}>
                <p>{user.username}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div>
          <StyledMainVideo autoPlay ref={remoteVideoPlayer} />
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
            <div>
              <div>
                <video
                  autoPlay
                  muted
                  ref={videoPlayer}
                  style={{ height: '100%', width: '100%', padding: 5 }}
                />
              </div>
            </div>
          </Rnd>
        </div>
      </div>
    </StyledChat>
  );
}

export default Chat;
