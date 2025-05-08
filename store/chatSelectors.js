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
