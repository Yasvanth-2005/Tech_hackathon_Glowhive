import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk for fetching complaints
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (token, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL; 
      const response = await axios.get(`${apiUrl}/complaints/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // return the data on success
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints'); // return error message on failure
    }
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null; // Clear any previous error
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload; // Store fetched data
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  },
});

export default complaintsSlice.reducer;
