import { useEffect, useState, useCallback } from 'react';
import { removeUser, setField, setUsers } from '../store/reducer';
import { useStore } from '../store/Store';

const useSocket = (remoteVideoPlayer) => {
  const [store, dispatch] = useStore()
  const [calling, setCalling] = useState()
  console.log(process.env.NODE_ENV)

  const addMediaTracks = useCallback(async (peerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
    peerConnection.ontrack = ({ streams: [stream] }) => {
      console.log('stream coming through!', stream)
      remoteVideoPlayer.current.srcObject = stream;
    };
  }, [remoteVideoPlayer])

  const callUser = useCallback(async (socketId, makeNewConnection = true) => {
    let newPeerConnection = store.peerConnection;
    if (makeNewConnection) {
      dispatch(setField({calling: socketId }))
      newPeerConnection = new window.RTCPeerConnection()
      newPeerConnection.onicecandidate = event => {
        store.socket.emit('candidate', { to: socketId, candidate: event.candidate 
        })
      }
    } 
    // const newPeerConnection = new window.RTCPeerConnection();
    // const newPeerConnection = store.peerConnection;
    dispatch(setField({ peerConnection: newPeerConnection }));
    await addMediaTracks(newPeerConnection);
    
    
    const offer = await newPeerConnection.createOffer();
    await newPeerConnection.setLocalDescription(new RTCSessionDescription(offer));
    
    console.log('calling user', socketId);
    store.socket.emit("call-user", {
      offer,
      to: socketId
    });
   }, [addMediaTracks, store.peerConnection, store.socket, dispatch]);

  useEffect(() => {
    if (store.socket) {
      console.log('rebuilding events for connection', store.peerConnection)
      store.socket.on('update-user-list', (event) => dispatch(setUsers(event.users)))
      store.socket.on('remove-user', ({ socketId }) => dispatch(removeUser(socketId)));
  
      store.socket.on("call-made", async data => {
        console.log('receiving a call!! gonna answer it!! from', data.socket, 'offer', data.offer)
        const newPeerConnection = new window.RTCPeerConnection();
        newPeerConnection.onicecandidate = event => {
          store.socket.emit('candidate', { to: data.socket, candidate: event.candidate })
        }
        dispatch(setField({ peerConnection: newPeerConnection }));
        await addMediaTracks(newPeerConnection);


        await newPeerConnection.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await newPeerConnection.createAnswer();
        await newPeerConnection.setLocalDescription(new RTCSessionDescription(answer));
       
        store.socket.emit("make-answer", {
          answer,
          to: data.socket
        });
      });

    store.socket.on("answer-made", async data => {
      console.log('they aswered')
      console.warn('calling', calling)
      await store.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      await addMediaTracks(store.peerConnection)

      // store.peerConnection.ontrack = ({ streams: [stream] }) => {
      //   console.log('stream coming through! ')
      //   remoteVideoPlayer.current.srcObject = stream;
      // };
      
      // store.peerConnection.ontrack = ({ streams: [stream] }) => {
      //   remoteVideoPlayer.current.srcObject = stream;
      // };
      if (!calling) {
        callUser(data.socket, false);
        setCalling(true)
        // setVideoStream(store.peerConnection)
        // store.socket.off("answer-made")
      }
      
      // if (!isCalling) {
      //   setIsCalling(true);
      // }
     });



    store.socket.on("candidate",  data => {
      if (store.peerConnection && data.candidate) {
        console.log('candidate coming through!', data.candidate)
        store.peerConnection.addIceCandidate(data.candidate).catch(console.error);
      }
    });



    }
    return () => {
      if (store.socket) {
        store.socket.off('update-user-list')
        store.socket.off('remove-user')
        store.socket.off("call-made")
        store.socket.off("answer-made")
        store.socket.off("candidate")
      }
    }
  }, [store.socket, store.peerConnection, dispatch, calling, remoteVideoPlayer, callUser, addMediaTracks])
  
  return [callUser]
}

export default useSocket;