import { createSelector } from '@reduxjs/toolkit';

/**
 * Memoized selector để lấy tin nhắn theo conversationId
 * Tránh tạo mảng mới mỗi lần render
 */
export const selectMessagesByConversation = (conversationId) =>
  createSelector(
    (state) => state.chat.messagesByConversation,
    (messagesByConversation) =>
      messagesByConversation[conversationId] || []
  );

export const selectMembersByConversationId = (conversationId) =>
  createSelector(
    (state) => state.chat.conversations,
    (conversations) => {
      const conv = conversations.find(c => c._id === conversationId);
      return conv?.members || [];
    }
  );