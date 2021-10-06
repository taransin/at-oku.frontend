import { useLocalization } from '@fluent/react';
import { FC, RefObject, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSocket from 'src/hooks/useSocket';
import { SocketContext } from 'src/providers/SocketProvider';
import { usersSelector } from 'src/store/selectors';
import styled from 'styled-components';
import Title from './Title';

const StyledSidebar = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
    width: 140,
  },
  ({ theme }) => ({
    background: theme.colors.background.dark,
    boxShadow: `inset -2px 0 0 0 ${theme.colors.accent}`,
  }),
);

const Sidebar: FC<{ remoteVideoPlayer: RefObject<HTMLVideoElement> }> = ({
  remoteVideoPlayer,
  children,
}) => {
  const { l10n } = useLocalization();
  const users = useSelector(usersSelector);
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

  return (
    <StyledSidebar>
      <Title text="@OKU" />
      <p>
        <strong>{l10n.getString('online-users')}</strong>:<br />
        {users.length > 0 ? (
          users.map((user, key) => (
            <span key={key} onClick={() => callUser(user.id)}>
              {user.username}
            </span>
          ))
        ) : (
          <small>
            <i>{l10n.getString('online-users-none')}</i>
          </small>
        )}
      </p>
      {children}
    </StyledSidebar>
  );
};

export default Sidebar;
