import { RefObject, useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const StyledChat = styled.div(
  {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    padding: 15,
  },
  ({ theme }) => ({
    background: theme.colors.background.dark,
  }),
);

const StyledRemoteCamera = styled.video(
  {
    height: '100%',
    width: '100%',
  },
  ({ theme }) => ({
    background: theme.colors.background.medium,
  }),
);

const StyledLocalCamera = styled(Rnd)(
  {
    display: 'flex!important',
    justifyContent: 'center!important',
    alignItems: 'center!important',
    padding: 4,
  },
  ({ theme }) => ({
    background: theme.colors.background.dark,
    boxShadow: `inset 0 0 0 2px ${theme.colors.accent}`,
  }),
);

interface ChatProps {
  localCamera: RefObject<HTMLVideoElement>;
  remoteCamera: RefObject<HTMLVideoElement>;
}

const Chat = ({ localCamera, remoteCamera }: ChatProps) => {
  const setVideoStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const current = localCamera.current;
      if (current) {
        current.srcObject = stream;
      }
    } catch (error: any) {
      console.warn(error.message);
    }
  }, [localCamera]);

  useEffect(() => {
    if (localCamera && localCamera.current) {
      setVideoStream();
    }
  }, [localCamera, setVideoStream]);

  return (
    <StyledChat>
      <StyledRemoteCamera autoPlay ref={remoteCamera} />
      <StyledLocalCamera
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
        <video
          autoPlay
          muted
          ref={localCamera}
          style={{
            display: 'flex',
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        />
      </StyledLocalCamera>
    </StyledChat>
  );
};

export default Chat;
