import { useEffect, useState, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebSocketContext } from 'src/providers/SocketProvider';
import { RootState } from 'src/store/store';
import { removeUser, setField, setUsers } from '../store/reducer';

const useSocket = (remoteVideoPlayer) => {
  const dispatch = useDispatch();
  const [calling, setCalling] = useState<boolean>(false)

  const [peerConnection] = useSelector((state: RootState) => [
    state.application.peerConnection,
  ]);

  const socket = useContext(WebSocketContext);

  const addMediaTracks = useCallback(async (peerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
    peerConnection.ontrack = ({ streams: [stream] }) => {
      remoteVideoPlayer.current.srcObject = stream;
    };
  }, [remoteVideoPlayer])

  const callUser = useCallback(async (socketId, makeNewConnection = true) => {
    let newPeerConnection = peerConnection;
    if (makeNewConnection) {
      dispatch(setField({ calling: socketId }))
      newPeerConnection = new window.RTCPeerConnection()
      newPeerConnection.onicecandidate = event => {
        socket.emit('candidate', {
          to: socketId, candidate: event.candidate
        })
      }
    }
    // const newPeerConnection = new window.RTCPeerConnection();
    // const newPeerConnection = peerConnection;
    dispatch(setField({ peerConnection: newPeerConnection }));
    await addMediaTracks(newPeerConnection);


    const offer = await newPeerConnection.createOffer();
    await newPeerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit("call-user", {
      offer,
      to: socketId
    });
  }, [addMediaTracks, peerConnection, socket, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on('update-user-list', (event) => dispatch(setUsers(event.users)))
      socket.on('remove-user', ({ socketId }) => dispatch(removeUser(socketId)));

      socket.on("call-made", async data => {
        const newPeerConnection = new window.RTCPeerConnection();
        newPeerConnection.onicecandidate = event => {
          socket.emit('candidate', { to: data.socket, candidate: event.candidate })
        }
        dispatch(setField({ peerConnection: newPeerConnection }));
        await addMediaTracks(newPeerConnection);


        await newPeerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await newPeerConnection.createAnswer();
        await newPeerConnection.setLocalDescription(new RTCSessionDescription(answer));

        socket.emit("make-answer", {
          answer,
          to: data.socket
        });
      });

      socket.on("answer-made", async data => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );

        await addMediaTracks(peerConnection)
        if (!calling) {
          callUser(data.socket, false);
          setCalling(true)
        }
      });



      socket.on("candidate", data => {
        if (peerConnection && data.candidate) {
          peerConnection.addIceCandidate(data.candidate).catch(console.error);
        }
      });



    }
    return () => {
      if (socket) {
        socket.off('update-user-list')
        socket.off('remove-user')
        socket.off("call-made")
        socket.off("answer-made")
        socket.off("candidate")
      }
    }
  }, [socket, peerConnection, dispatch, calling, remoteVideoPlayer, callUser, addMediaTracks])

  return [callUser]
}

export default useSocket;