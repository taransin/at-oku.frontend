import { useEffect, useState, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { SocketContext } from 'src/providers/SocketProvider';
import { removeUser, setField, setUsers } from '../store/reducer';

const TURN_SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'turn:localhost:4000?transport=tcp'
    : 'turn:at-oku.herokuapp.com?transport=tcp';

const useSocket = (remoteVideoPlayer, peerConnection, socket) => {
  const dispatch = useDispatch();
  const [calling, setCalling] = useState<boolean>();
  const { setPeerConnection } = useContext(SocketContext);

  const addMediaTracks = useCallback(
    async (peerConnection) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      peerConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideoPlayer.current.srcObject = stream;
      };
    },
    [remoteVideoPlayer],
  );

  const createNewRTCConnection = () =>
    new window.RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
        {
          urls: 'stun:stun3.l.google.com:19302',
        },
        {
          urls: 'stun:stun4.l.google.com:19302',
        },
        {
          urls: TURN_SERVER_URL,
          username: 'username',
          credential: 'password',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808',
        },
        {
          urls: 'turn:turn.bistri.com:80',
          credential: 'homeo',
          username: 'homeo',
        },
        {
          urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
          credential: 'webrtc',
          username: 'webrtc',
        },
      ],
    });

  const callUser = useCallback(
    async (socketId, makeNewConnection = true) => {
      let newPeerConnection = peerConnection;
      if (makeNewConnection) {
        dispatch(setField({ calling: socketId }));
        newPeerConnection = createNewRTCConnection();
        // newPeerConnection.onicecandidate = event => {
        //   socket.emit('candidate', {
        //     to: socketId, candidate: event.candidate
        //   })
        // }
      }
      // const newPeerConnection = new window.RTCPeerConnection();
      // const newPeerConnection = peerConnection;
      setPeerConnection(newPeerConnection);
      await addMediaTracks(newPeerConnection);

      const offer = await newPeerConnection.createOffer();
      await newPeerConnection.setLocalDescription(
        new RTCSessionDescription(offer),
      );

      socket.emit('call-user', {
        offer,
        to: socketId,
      });
    },
    [addMediaTracks, peerConnection, socket, dispatch, setPeerConnection],
  );

  useEffect(() => {
    if (socket) {
      socket.on('update-user-list', (event) => {
        console.log('update-user-list >>>>>>> ', event);
        dispatch(setUsers(event.users));
      });
      socket.on('remove-user', ({ socketId }) => {
        console.log('remove-user >>>>>>> ', socketId);
        dispatch(removeUser(socketId));
      });

      socket.on('call-made', async (data) => {
        console.log('call-made >>>>>>> ', data);
        const newPeerConnection = createNewRTCConnection();
        // newPeerConnection.onicecandidate = event => {
        //   socket.emit('candidate', { to: data.socket, candidate: event.candidate })
        // }
        dispatch(setField({ peerConnection: newPeerConnection }));
        await addMediaTracks(newPeerConnection);

        await newPeerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await newPeerConnection.createAnswer();
        await newPeerConnection.setLocalDescription(
          new RTCSessionDescription(answer),
        );

        socket.emit('make-answer', {
          answer,
          to: data.socket,
        });
      });

      socket.on('answer-made', async (data) => {
        console.log('answer-made >>>>>>> ', data);
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );

        await addMediaTracks(peerConnection);
        if (!calling) {
          callUser(data.socket, false);
          setCalling(true);
        }
      });

      socket.on('candidate', (data) => {
        console.log('candidate >>>>>>> ', data);
        if (peerConnection && data.candidate) {
          peerConnection.addIceCandidate(data.candidate).catch(console.error);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('update-user-list');
        socket.off('remove-user');
        socket.off('call-made');
        socket.off('answer-made');
        socket.off('candidate');
      }
    };
  }, [
    socket,
    peerConnection,
    dispatch,
    calling,
    remoteVideoPlayer,
    callUser,
    addMediaTracks,
  ]);

  return [callUser];
};

export default useSocket;
