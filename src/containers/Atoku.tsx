import { useRef } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import { Chat } from '.';

const StyledAtoku = styled.div({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexGrow: 1,
});

const Atoku = () => {
  const localCamera = useRef<HTMLVideoElement>(null);
  const remoteCamera = useRef<HTMLVideoElement>(null);

  return (
    <StyledAtoku>
      <Sidebar remoteVideoPlayer={remoteCamera} />
      <Chat localCamera={localCamera} remoteCamera={remoteCamera} />
    </StyledAtoku>
  );
};

export default Atoku;
