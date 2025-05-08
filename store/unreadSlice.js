import { createSlice } from '@reduxjs/toolkit';

const unreadSlice = createSlice({
  name: 'unread',
  initialState: {},
  reducers: {
    increaseUnread: (state, action) => {
      const conversationId = action.payload;
      state[conversationId] = (state[conversationId] || 0) + 1;
    },
    resetUnread: (state, action) => {
      const conversationId = action.payload;
      state[conversationId] = 0;
    },
    clearAllUnread: () => {
      return {};
    },
  },
});

export const { increaseUnread, resetUnread, clearAllUnread } = unreadSlice.actions;
export default unreadSlice.reducer;
