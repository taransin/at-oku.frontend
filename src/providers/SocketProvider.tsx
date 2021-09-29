import React, { Children, ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { RootState } from 'src/store/store';

interface WebSocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/'
    : 'https://at-oku.herokuapp.com/';

export const SocketContext = React.createContext<{
  socket: any;
  peerConnection?: RTCPeerConnection;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
}>({
  socket: (io as any).connect(SOCKET_URL),
  peerConnection: undefined,
  setPeerConnection: () => {},
});

export const SocketProvider = (props: WebSocketProviderProps) => {
  const [username] = useSelector((state: RootState) => [
    state.application.username,
  ]);

  const [currentUsername, setCurrentUsername] = useState(username);
  const [socket, setSocket] = useState<any>(undefined);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  useEffect(() => {
    if (username !== currentUsername) {
      setCurrentUsername(username);

      setSocket(
        (io as any).connect(SOCKET_URL, username && { query: { username } }),
      );
    }
  }, [username, currentUsername]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        peerConnection,
        setPeerConnection,
      }}
    >
      {Children.only(props.children)}
    </SocketContext.Provider>
  );
};
