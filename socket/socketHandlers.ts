// socket/socketHandlers.ts
import socket from './socket';
import { showNotification } from '../Custom/notification';
import { incrementUnreadCount } from '../store/unreadSlice';

export const setupSocketListeners = ({
  userId,
  token,
  conversations,
  currentConversationId,
  dispatch,
  setToastMsg,
  setToastVisible,
}: {
  userId: string;
  token: string;
  conversations: any[];
  currentConversationId: string | null;
  dispatch: any;
  setToastMsg: (msg: any) => void;
  setToastVisible: (visible: boolean) => void;
}) => {
  // 🚪 Join tất cả các phòng đã tham gia
  conversations.forEach(conv => {
    socket.emit("joinRoom", conv._id);
  });
  console.log("🔁 Đã tham gia tất cả các phòng hội thoại");

  // 📥 Xử lý tin nhắn đến
  const handleReceiveMessage = (msg: any) => {
    const isSender = msg.senderId === userId;
    if (isSender) return;

    const isActive = msg.conversationId === currentConversationId;

    if (!isActive) {
      showNotification(`${msg.name} đã nhắn: ${msg.content}`, "success");

    //   setToastMsg({
    //     name: msg.name,
    //     content: msg.content,
    //     senderAvatar: msg.senderAvatar,
    //     timestamp: msg.timestamp,
    //   });
    //   setToastVisible(true);
    }

    dispatch(incrementUnreadCount(msg.receiverId, msg.conversationId, token));

    dispatch({
      type: 'chat/updateLastMessage',
      payload: {
        conversationId: msg.conversationId,
        content: msg.content,
        senderId: msg.senderId,
        name: msg.name,
        timestamp: msg.timestamp,
      },
    });
  };

  socket.on("receiveMessage", handleReceiveMessage);

  // 👉 Trả về hàm cleanup để dùng trong `useEffect`
  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
    console.log("🛑 Đã huỷ lắng nghe receiveMessage");
  };
};
