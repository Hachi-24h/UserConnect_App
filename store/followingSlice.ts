import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';

const BASE_URL = ip.BASE_URL;

// Interface người dùng
export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  username?: string;
}

interface FollowingState {
  dsFollowing: User[];
  loading: boolean;
  error: string | null;
}

interface FollowPayload {
  followerId: string;
  followingId: string;
}

const initialState: FollowingState = {
  dsFollowing: [],
  loading: false,
  error: null,
};

// ✅ Lấy danh sách followings
export const fetchFollowings = createAsyncThunk<User[], string>(
  'followings/fetchFollowings',
  async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/follow/followings/${userId}`);
    return response.data.data.map((item: any) => item.user);
  }
);

// ✅ Follow người dùng
export const followUser = createAsyncThunk(
  'followings/followUser',
  async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
    const link =  `${BASE_URL}/follow`;
    console.log("link",link)
    const response = await axios.post(
    link ,
      { followingId },
      {
        headers: {
          'x-user-id': followerId,
        },
      }
    );
   return response.data;
  }
);
export const unfollowUser = createAsyncThunk(
  'followings/unfollowUser',
  async ({ followerId, followingId }: { followerId: string; followingId: string }) => {
    const link =  `${BASE_URL}/follow/unfollow`;
    console.log("link",link)
    const response = await axios.post(
    link ,
      { followingId },
      {
        headers: {
          'x-user-id': followerId,
        },
      }
    );
   return response.data;
  }
);


// ✅ Unfollow người dùng
// export const unfollowUser = createAsyncThunk<string, FollowPayload>(
//   'followings/unfollowUser',
//   async ({ followerId, followingId }) => {
//     await axios.post(
//       `${BASE_URL}/follow/unfollow`,
//       { followingId },
//       { headers: { 'x-user-id': followerId } }
//     );
//     return followingId;
//   }
// );

// ✅ Slice
const followingSlice = createSlice({
  name: 'followings',
  initialState,
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
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const newUser = action.payload;
        if (!state.dsFollowing.find((u) => u._id === newUser._id)) {
          state.dsFollowing.push(newUser);
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const unfollowId = action.payload;
        state.dsFollowing = state.dsFollowing.filter((u) => u._id !== unfollowId);
      });
  },
});

export default followingSlice.reducer;
