import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 👤 Định nghĩa kiểu cho user (có thể mở rộng nếu cần)
export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
  avatar?: string;
  // thêm các field khác nếu có
}

const initialState: User | null = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_state, action) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
