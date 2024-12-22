// src/slices/reposSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  repos: [],
  error: ''
};

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setRepos(state, action) {
      state.repos = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUsername, setRepos, setError } = reposSlice.actions;
export default reposSlice.reducer;
