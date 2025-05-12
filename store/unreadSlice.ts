import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
const BASE_URL = ip.BASE_URL;

// ================= Types =================
interface UnreadState {
  [conversationId: string]: number;
}

interface UnreadPayload {
  userId: string;
  conversationId: string;
  token: string;
}

// ================= Slice =================
const unreadSlice = createSlice({
  name: 'unread',
  initialState: {} as UnreadState,

  reducers: {
    setUnreadCounts: (state, action: PayloadAction<UnreadState>) => {
      return { ...action.payload };
    },
    increaseUnread: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state[id] = (state[id] || 0) + 1;
    },
    resetUnread: (state, action: PayloadAction<string>) => {
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

// ================= Async Thunks =================

export const incrementUnreadCount = ({ userId, conversationId, token }: UnreadPayload) => async (dispatch: any) => {
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
  } catch (error: any) {
    console.error("❌ Lỗi tăng unread:", error.response?.data || error.message);
  }
};

export const resetUnreadCount = (userId: string, conversationId: string, token: string) => async (dispatch: any) => {
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
  } catch (error: any) {
    console.error("❌ Lỗi reset unread:", error.response?.data || error.message);
  }
};

export default unreadSlice.reducer;
