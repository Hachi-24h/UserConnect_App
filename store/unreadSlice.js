import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
const BASE_URL = ip.BASE_URL;

const unreadSlice = createSlice({
  name: 'unread',
  initialState: {},

  reducers: {
    setUnreadCounts: (state, action) => {
      return { ...action.payload };
    },
    increaseUnread: (state, action) => {
      const id = action.payload;
      state[id] = (state[id] || 0) + 1;
    },
    resetUnread: (state, action) => {
      const id = action.payload;
      state[id] = 0;
    },
    clearAllUnread: () => {
      return {};
    },
  },
});

export const {
  setUnreadCounts,
  increaseUnread,
  resetUnread,
  clearAllUnread,
} = unreadSlice.actions;

// ✅ Gọi API tăng tin chưa đọc + update Redux
export const incrementUnreadCount = (userId, conversationId, token) => async (dispatch) => {
  try {
    await axios.patch(
      `${BASE_URL}/chat/deleted-conversations/unread-count/increment`,
      { userId, conversationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(increaseUnread(conversationId));
  } catch (error) {
    console.error("❌ Lỗi tăng unread:", error.response?.data || error.message);
  }
};

// ✅ Gọi API đặt unread = 0 + update Redux
export const resetUnreadCount = (userId, conversationId, token) => async (dispatch) => {
  try {
    await axios.patch(
      `${BASE_URL}/chat/deleted-conversations/unread-count`,
      { userId, conversationId, unreadCount: 0 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(resetUnread(conversationId));
  } catch (error) {
    console.error("❌ Lỗi reset unread:", error.response?.data || error.message);
  }
};

export default unreadSlice.reducer;
