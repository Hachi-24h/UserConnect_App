import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
import { setUnreadCounts } from './unreadSlice';

const BASE_URL = ip.BASE_URL;

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [], // chứa danh sách các cuộc trò chuyện
    messagesByConversation: {}, // { conversationId: [msg1, msg2, ...] }
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
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
    clearConversations: (state) => {
      state.conversations = [];
      state.messagesByConversation = {};
    },
  },
});

export const {
  setConversations,
  setMessages,
  addMessage,
  clearMessages,
  clearConversations,
} = chatSlice.actions;

export default chatSlice.reducer;

export const fetchConversations = (userId, token) => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/conversations/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawConversations = res.data;

    const conversationsFormatted = [];
    const messagesMap = {};
    const unreadMap = {};

    for (const conv of rawConversations) {
      unreadMap[conv._id] = conv.unreadCount || 0;

      // ✅ Nếu là tin nhắn cá nhân thì lưu thông tin người kia
      const otherUser = !conv.isGroup && conv.members?.find(m => m._id !== userId);

      conversationsFormatted.push({
        _id: conv._id,
        isGroup: conv.isGroup,
        groupName: conv.groupName || '',
        avatar: conv.avatar || '',
        updatedAt: conv.updatedAt,
        lastMessage: conv.messages?.[conv.messages.length - 1]?.content || '',
        otherUser: otherUser ? {
          _id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar
        } : null,
      });

      // ✅ Gộp tin nhắn
      const formattedMessages = (conv.messages || []).map(msg => ({
        _id: msg._id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      messagesMap[conv._id] = formattedMessages;
    }

    dispatch(setUnreadCounts(unreadMap));
    dispatch(setConversations(conversationsFormatted));

    for (const [conversationId, messages] of Object.entries(messagesMap)) {
      dispatch(setMessages({ conversationId, messages }));
    }

    console.log("✅ Redux updated: conversations + messages");
  } catch (err) {
    console.error("❌ Failed to fetch conversations", err);
  }
};
