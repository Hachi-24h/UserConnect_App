import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import ip from '../config/IpAddress';
import { setUnreadCounts } from './unreadSlice';

const BASE_URL = ip.BASE_URL;

// ================= Types =================
interface Message {
  _id?: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface OtherUser {
  _id: string;
  name: string;
  avatar: string;
}

interface Conversation {
  _id: string;
  isGroup: boolean;
  groupName: string;
  avatar: string;
  updatedAt?: string;
  lastMessage?: string;
  lastMessageSenderId?: string; // ✅ THÊM DÒNG NÀY
  otherUser?: {
    _id: string;
    name: string;
    avatar: string;
  } | null;
}


interface ChatState {
  conversations: Conversation[];
  messagesByConversation: {
    [conversationId: string]: Message[];
  };
}

// ================= Initial State =================
const initialState: ChatState = {
  conversations: [],
  messagesByConversation: {},
};

// ================= Slice =================
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(message);
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        content: string;
        timestamp: string;
        senderId: string;
      }>
    ) => {
      const { conversationId, content, timestamp, senderId } = action.payload;
      const conversation = state.conversations.find(conv => conv._id === conversationId);
      if (conversation) {
        conversation.lastMessage = content;
        conversation.updatedAt = timestamp;
        conversation.lastMessageSenderId = senderId; // ✅ Ghi thẳng, không cần check
      }
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messagesByConversation[action.payload];
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
  updateLastMessage,
  clearMessages,
  clearConversations,
} = chatSlice.actions;

export default chatSlice.reducer;

// ================= Async Action =================
export const fetchConversations = (userId: string, token: string) => async (dispatch: any) => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/conversations/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawConversations = res.data;

    const conversationsFormatted: Conversation[] = [];
    const messagesMap: { [key: string]: Message[] } = {};
    const unreadMap: { [key: string]: number } = {};

    for (const conv of rawConversations) {
      unreadMap[conv._id] = conv.unreadCount || 0;

      const otherUser =
        !conv.isGroup && conv.members?.find((m: any) => m._id !== userId);
      const lastMsg = conv.messages?.[conv.messages.length - 1];
      let displayContent = lastMsg?.content || '';
      if (lastMsg?.type === 'image') {
        displayContent = 'Đã gửi một ảnh mới';
      } else if (lastMsg?.type === 'file') {
        displayContent = 'Đã gửi một file mới';
      }
      conversationsFormatted.push({
        _id: conv._id,
        isGroup: conv.isGroup,
        groupName: conv.groupName || '',
        avatar: conv.avatar || '',
        updatedAt: conv.updatedAt,
        lastMessage: displayContent || '',
        lastMessageSenderId: lastMsg?.senderId || null, // ✅ Dòng mới
        otherUser: otherUser
          ? {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar,
          }
          : null,
      });
      messagesMap[conv._id] = (conv.messages || []).map((msg: any) => ({
        _id: msg._id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    }

    dispatch(setUnreadCounts(unreadMap));
    dispatch(setConversations(conversationsFormatted));

    for (const [conversationId, messages] of Object.entries(messagesMap)) {
      dispatch(setMessages({ conversationId, messages }));
    }

    console.log("✅ Redux updated: conversations + messages");
  } catch (err: any) {
    console.error("❌ Failed to fetch conversations", err.response?.data || err.message);
  }
};
