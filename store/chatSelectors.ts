import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

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
/**
 * Selector: lấy danh sách tin nhắn theo conversationId (memoized)
 */
export const selectMessagesByConversation = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.chat.messagesByConversation,
    (messagesByConversation): Message[] =>
      messagesByConversation[conversationId] || []
  );

/**
 * Selector: lấy danh sách thành viên trong cuộc trò chuyện
 */
export const selectMembersByConversationId = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.chat.conversations,
    (conversations): Member[] => {
      const conv = conversations.find(c => c._id === conversationId);
      return conv?.members || [];
    }
  );
