// store/userDetailSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDetailState {
  info: any | null;                 // thông tin người dùng (cũ)
  currentConversationId: string | null; // phòng chat hiện tại
}

const initialState: UserDetailState = {
  info: null,
  currentConversationId: null,
};

const userDetailSlice = createSlice({
  name: 'userDetail',
  initialState,
  reducers: {
    // ✅ cập nhật thông tin user
    setUserDetail: (state, action: PayloadAction<any>) => {
      state.info = action.payload;
    },
    // ✅ xóa thông tin user
    clearUserDetail: (state) => {
      state.info = null;
      state.currentConversationId = null;
    },
    // ✅ gán ID đoạn chat hiện tại
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
  },
});

export const {
  setUserDetail,
  clearUserDetail,
  setCurrentConversationId,
} = userDetailSlice.actions;

export default userDetailSlice.reducer;
