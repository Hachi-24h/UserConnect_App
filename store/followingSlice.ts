// redux/followingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
const BASE_URL = ip.BASE_URL
// Async thunk để fetch danh sách following
export const fetchFollowings = createAsyncThunk(
  'followings/fetchFollowings',
  async (userId: string) => {
    const response = await axios.get(
      `${BASE_URL}/follow/followings/${userId}`
    );
    return response.data.data.map((item: any) => item.user);
  }
);

const followingSlice = createSlice({
  name: 'followings',
  initialState: {
    dsFollowing: [],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowings.fulfilled, (state, action) => {
        state.loading = false;
        state.dsFollowing = action.payload;
      })
      .addCase(fetchFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export default followingSlice.reducer;
