import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk(
  'data/fetchUsers',
  async (token, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the data on success
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users'); // Return error message on failure
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Store fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  },
});

export default usersSlice.reducer;
