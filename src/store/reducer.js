import io from 'socket.io-client'

export const SET_USERS = 'APP/SET_USERS';
export const REMOVE_USER = 'APP/REMOVE_USER';
export const SET_SOCKET = 'APP/SET_SOCKET';
export const SET_PEER_CONNECTION = 'APP/SET_PEER_CONNECTION';


export const SET_FIELD = 'APP/SET_FIELD'



export const setUsers = users => ({
  type: SET_USERS,
  users,
});

export const removeUser = user => ({
  type: REMOVE_USER,
  user,
});

export const setSocket = socket => ({
  type: SET_SOCKET,
  socket
})
export const setPeerConnection = peerConnection => ({
  type: SET_PEER_CONNECTION,
  peerConnection
})

export const setField = (fieldObject) => ({
  type: SET_FIELD,
  ...fieldObject,
});

export const initialState = {
  users: [],
  // socket: io.connect('http://localhost:4000/'),
  socket: io.connect('https://at-oku.herokuapp.com/'),
  peerConnection: null
};

export const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      };
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(user => user !== action.user)
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: action.socket
      };
    case SET_PEER_CONNECTION:
      return {
        ...state,
        peerConnection: action.peerConnection
      };
    case SET_FIELD:
      const { type, ...fields } = action;
      return {
        ...state,
        ...fields,
      }
    default: return state;
  }
};
