import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as io from 'socket.io-client';

export interface ApplicationState {
  users: any[];
  socket?: io.Socket;
  peerConnection: any;
  username?: string;
}

const initialState: ApplicationState = {
  users: [],
  // socket: io.connect('http://localhost:4000/'),
  socket: undefined,
  peerConnection: null,
  username: undefined,
};

const SOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/'
    : 'https://at-oku.herokuapp.com/';

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.users = action.payload;
    },
    removeUser: (state, action: PayloadAction<any>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },
    setPeerConnection: (state, action: PayloadAction<any>) => {
      state.peerConnection = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      const username = action.payload;
      state.username = username;
      state.socket = (io as any).connect(SOCKET_URL, { query: { username } });
    },
    setField: (state, action: PayloadAction<any>) => {
      const { type, ...fields } = action;
      state = { ...state, ...fields };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUsers,
  removeUser,
  setSocket,
  setUsername,
  setPeerConnection,
  setField,
} = applicationSlice.actions;

export default applicationSlice.reducer;
