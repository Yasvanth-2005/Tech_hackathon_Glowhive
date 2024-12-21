import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk for fetching complaints
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (token, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL; // URL from environment variable
      const response = await axios.get(`${apiUrl}/complaints/admin`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to request headers
        },
      });
      return response.data; // Return fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints'); // Handle error
    }
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [], // Store complaints
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false; // Stop loading
        state.complaints = action.payload; // Store the fetched complaints data
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false; // Stop loading
        state.error = action.payload; // Store error message
      });
  },
});

export default complaintsSlice.reducer;
