import socket from './socket';
import { showNotification } from '../Custom/notification';
import { incrementUnreadCount } from '../store/unreadSlice';
import { addMessage, updateLastMessage } from '../store/chatSlice';

interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: string;
    name?: string;
    senderAvatar?: string;
}

interface SetupSocketParams {
    userId: string;
    token: string;
    conversations: any[];
    currentConversationId: string | null;
    dispatch: any;
    setToastMsg: (msg: any) => void;
    setToastVisible: (visible: boolean) => void;
}

export const setupSocketListeners = ({
    userId,
    token,
    conversations,
    currentConversationId,
    dispatch,
    setToastMsg,
    setToastVisible,
}: SetupSocketParams) => {
    // 🚪 Join tất cả các phòng
    conversations.forEach(conv => {
        socket.emit("joinRoom", conv._id);
    });
    console.log("🔁 Đã tham gia tất cả các phòng hội thoại");

    const handleReceiveMessage = (msg: Message) => {
        const isSender = msg.senderId === userId;
        if (isSender) return;

        const isActive = msg.conversationId === currentConversationId;

        // 🔔 Hiển thị thông báo nếu không ở trong phòng đó
        if (!isActive) {
            showNotification(`${msg.name} đã nhắn: ${msg.content}`, "success");

            // Nếu muốn toast UI (tuỳ chọn)
            // setToastMsg({
            //   name: msg.name,
            //   content: msg.content,
            //   senderAvatar: msg.senderAvatar,
            //   timestamp: msg.timestamp,
            // });
            // setToastVisible(true);
        }

        // ✅ Thêm tin nhắn mới vào Redux
        dispatch(addMessage({
            conversationId: msg.conversationId,
            message: {
                _id: msg._id,
                senderId: msg.senderId,
                content: msg.content,
                timestamp: msg.timestamp,
            }
        }));

        // ✅ Cập nhật tin nhắn cuối
        dispatch(updateLastMessage({
            conversationId: msg.conversationId,
            content: msg.content,
            timestamp: msg.timestamp,
            senderId: msg.senderId, // ✅ đúng luôn
        }));

        // ✅ Tăng số tin chưa đọc nếu đang không ở trong phòng
        if (!isActive) {
            dispatch(incrementUnreadCount({
                userId,
                conversationId: msg.conversationId,
                token,
            }));
        }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        console.log("🛑 Đã huỷ lắng nghe receiveMessage");
    };
};
