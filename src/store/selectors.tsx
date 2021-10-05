import { RootState } from './store';

export const usernameSelector = (state: RootState) =>
  state.application.username;
