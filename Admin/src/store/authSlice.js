import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // User will be rehydrated by redux-persist
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOut: (state) => {
      state.user = null; // No need to manually remove from localStorage
      localStorage.clear(); // Clear all stored session data
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut } = authSlice.actions;

export default authSlice.reducer;
