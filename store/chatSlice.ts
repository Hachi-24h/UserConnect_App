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
  type: string;
  name?: string;
  senderAvatar?: string;
  isDeleted?: boolean;
  isPinned?: boolean; // ✅ thêm dòng này
}

interface Member {
  userId: string;
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
  lastMessageSenderId?: string;
  otherUser?: {
    _id: string;
    name: string;
    avatar: string;
  } | null;
  members?: Member[];
  adminId?: string;
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
      state.messagesByConversation[conversationId] = [...messages];
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
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.lastMessage = content;
        conversation.updatedAt = timestamp;
        conversation.lastMessageSenderId = senderId;
      }
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messagesByConversation[action.payload];
    },
    clearConversations: (state) => {
      state.conversations = [];
      state.messagesByConversation = {};
    },
    revokeMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      const conv = state.messagesByConversation[conversationId];
      if (!conv) return;

      const msgIndex = conv.findIndex(msg => msg._id === messageId);
      if (msgIndex !== -1) {
        conv[msgIndex].content = "Message revoked";
        conv[msgIndex].isDeleted = true; // nếu You dùng flag này
        conv[msgIndex].type = "text"; // đổi về text để render đúng
      }
    },
    deleteMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const conv = state.messagesByConversation[conversationId];
      if (!conv) return;

      const index = conv.findIndex((msg) => msg._id === messageId);
      if (index !== -1) {
        conv.splice(index, 1); // Xoá tin nhắn

        // ✅ Sau khi xoá: cập nhật lại tin nhắn cuối cho hội thoại
        const conversation = state.conversations.find(c => c._id === conversationId);
        if (conversation) {
          const lastMsg = [...conv].reverse().find(msg => !msg.isDeleted); // tìm tin nhắn chưa bị xoá

          if (lastMsg) {
            let displayContent = lastMsg.content;
            if (lastMsg.type === 'image') displayContent = 'Sent a new picture';
            else if (lastMsg.type === 'file') displayContent = 'Sent a new file';

            conversation.lastMessage = displayContent;
            conversation.updatedAt = lastMsg.timestamp;
            conversation.lastMessageSenderId = lastMsg.senderId;
          } else {
            // Nếu không còn tin nhắn nào
            conversation.lastMessage = '';
            conversation.updatedAt = '';
            conversation.lastMessageSenderId = undefined;
          }
        }
      }
    },

  },
});

export const {
  setConversations,
  setMessages,
  addMessage,
  updateLastMessage,
  clearMessages,
  clearConversations, revokeMessage
  , deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer;

// ================= Async Action =================
export const fetchConversations = (userId: string, token: string) => async (dispatch: any) => {
  try {
    const res = await axios.get(`${BASE_URL}/chat/conversations/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawConversations = res.data;
    // console.log("✅ Fetched conversations:", rawConversations);

    const conversationsFormatted: Conversation[] = [];
    const messagesMap: { [key: string]: Message[] } = {};
    const unreadMap: { [key: string]: number } = {};

    for (const conv of rawConversations) {
      unreadMap[conv._id] = conv.unreadCount || 0;

      const lastMsg = conv.messages?.[conv.messages.length - 1];

      let displayContent = lastMsg?.content || '';
      if (lastMsg?.type === 'image') displayContent = 'Sent a photo';
      else if (lastMsg?.type === 'file') displayContent = 'Sent a file';

      const members: Member[] = conv.members?.map((m: any) => ({
        userId: m.userId,
        name: m.name,
        avatar: m.avatar || '',
      })) || [];

      const otherUser = !conv.isGroup
        ? members.find((m) => m.userId !== userId)
        : null;

      const msgList = (conv.messages || []).map((msg: any) => ({
        _id: msg._id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp,
        type: msg.type,
        name: msg.name,
        senderAvatar: msg.senderAvatar,
      }));

      if (msgList.length === 0) {
        dispatch(clearMessages(conv._id)); // Xóa tin nhắn cũ nếu trống
      } else {
        messagesMap[conv._id] = msgList;
      }

      conversationsFormatted.push({
        _id: conv._id,
        isGroup: conv.isGroup,
        groupName: conv.groupName || '',
        avatar: conv.avatar || '',
        updatedAt: lastMsg?.timestamp,
        adminId: conv.adminId || '', // ✅ thêm dòng này
        lastMessage: displayContent,
        lastMessageSenderId: lastMsg?.senderId || null,
        otherUser: otherUser
          ? {
              _id: otherUser.userId,
              name: otherUser.name,
              avatar: otherUser.avatar,
            }
          : null,
        members: members,
      });
    }

    dispatch(setUnreadCounts(unreadMap));
    dispatch(setConversations(conversationsFormatted));

    for (const [conversationId, messages] of Object.entries(messagesMap)) {
      dispatch(setMessages({ conversationId, messages }));
    }

    console.log("✅ Redux updated: conversations + messages + members");
  } catch (err: any) {
    console.error("❌ Failed to fetch conversations", err.response?.data || err.message);
  }
};

export const getConversationById = (state: any, conversationId: string) => {
  return state.chat.conversations.find((c: any) => c._id === conversationId);
};