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

export const WebSocketContext = React.createContext(
  (io as any).connect(SOCKET_URL),
);

export const SocketProvider = (props: WebSocketProviderProps) => {
  const [username] = useSelector((state: RootState) => [
    state.application.username,
  ]);

  const [currentUsername, setCurrentUsername] = useState(username);
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    if (username !== currentUsername) {
      setCurrentUsername(username);

      setSocket(
        (io as any).connect(SOCKET_URL, username && { query: { username } }),
      );
    }
  }, [username, currentUsername]);

  return (
    <WebSocketContext.Provider value={socket}>
      {Children.only(props.children)}
    </WebSocketContext.Provider>
  );
};
