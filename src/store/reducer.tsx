import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ApplicationState {
  users: any[];
  peerConnection: any;
  username?: string;
}

const initialState: ApplicationState = {
  users: [],
  peerConnection: null,
  username: undefined,
};

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
    setPeerConnection: (state, action: PayloadAction<any>) => {
      state.peerConnection = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      const username = action.payload;
      state.username = username;
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
  setUsername,
  setPeerConnection,
  setField,
} = applicationSlice.actions;

export default applicationSlice.reducer;
