import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
import { setUnreadCounts } from './unreadSlice';
const BASE_URL = ip.BASE_URL;

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messagesByConversation: {}, // { conversationId: [msg1, msg2, ...] }
    conversations: [], // Lưu danh sách các cuộc trò chuyện
  },
  reducers: {
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = messages;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(message);
    },
    clearMessages: (state, action) => {
      const conversationId = action.payload;
      delete state.messagesByConversation[conversationId];
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = [];
    },
  },
});

export const {
  setMessages,
  addMessage,
  setConversations,
  clearMessages,
  clearConversations,
} = chatSlice.actions;

// ✅ Thunk action để fetch lại conversations
export const fetchConversations = (userId, token) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/conversations/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const conversations = res.data;

    // 🔄 map unreadCount cho từng conversationId
    const unreadMap = {};
    conversations.forEach(conv => {
      unreadMap[conv._id] = conv.unreadCount || 0;
    });

    dispatch(setUnreadCounts(unreadMap));     // 👈 cập nhật unread vào Redux
    dispatch(setConversations(conversations)); // 👈 cập nhật danh sách cuộc trò chuyện

    console.log("🔄 Redux: fetched and updated conversations");
  } catch (error) {
    console.error("❌ Redux: fetch conversations failed:", error);
  }
};

export default chatSlice.reducer;
