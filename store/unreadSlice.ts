import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UnreadState = { [conversationId: string]: number };

const initialState: UnreadState = {};

const unreadSlice = createSlice({
  name: 'unread',
  initialState,
  reducers: {
    increaseUnread(state, action: PayloadAction<string>) {
      const id = action.payload;
      state[id] = (state[id] || 0) + 1;
    },
    resetUnread(state, action: PayloadAction<string>) {
      state[action.payload] = 0;
    },
  },
});

export const { increaseUnread, resetUnread } = unreadSlice.actions;
export default unreadSlice.reducer;