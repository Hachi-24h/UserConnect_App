import { io } from 'socket.io-client';
import BASE_URL from '../config/IpAddress';
import store from '../store/store';
import { increaseUnread } from '../store/unreadSlice'; // Đã sửa tên hàm chuẩn theo redux

const link_socket = `https://pulse-chat.up.railway.app`;

const socket = io(link_socket, {
  transports: ['websocket'],
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('📡 Socket connected');
});

// Khi nhận tin nhắn
socket.on('receiveMessage', (msg) => {
  const state = store.getState();

  const currentUserId = state.user && state.user._id;
  const currentConversationId =
    state.userDetail && state.userDetail.currentConversationId;
  const { senderId, conversationId } = msg;

  if (
    currentUserId &&
    senderId !== currentUserId &&
    conversationId !== currentConversationId
  ) {
    store.dispatch(increaseUnread(conversationId));
  }
});

export default socket;
