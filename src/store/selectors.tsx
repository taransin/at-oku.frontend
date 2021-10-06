import { RootState } from './store';

export const usernameSelector = (state: RootState) =>
  state.application.username;
export const usersSelector = (state: RootState) => state.application.users;
