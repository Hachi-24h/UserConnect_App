import socket from './socket';
import { showNotification } from '../Custom/notification';
import { incrementUnreadCount } from '../store/unreadSlice';
import { addMessage, updateLastMessage } from '../store/chatSlice';
import { playNotificationSound } from '../Custom/soundPlayer';

interface Message {
    _id: string;
    conversationId: string;
    isGroup: boolean;
    senderId: string;
    content: string;
    timestamp: string;
    name?: string;
    senderAvatar?: string;
    type: string; // Add this line if missing
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
        console.log("🛑 Tin nhắn nhận được: ", msg);
        if (isSender) return;

        const isActive = msg.conversationId === currentConversationId;


        playNotificationSound();
        let displayContent = msg.content;
        if (msg.type === "image") {
            displayContent = "Đã gửi một ảnh mới";
        } else if (msg.type === "file") {
            displayContent = "Đã gửi một file mới";
        }
        // 🔔 Hiển thị thông báo nếu không ở trong phòng đó
        if (!isActive) {
            // showNotification(`${msg.name} đã nhắn: ${msg.content}`, "success");

            // Nếu muốn toast UI (tuỳ chọn)
            setToastMsg({
                name: msg.name,
                content: displayContent,
                senderAvatar: msg.senderAvatar,
                timestamp: msg.timestamp,
            });
            setToastVisible(true);
        }

        // ✅ Thêm tin nhắn mới vào Redux
        dispatch(addMessage({
            conversationId: msg.conversationId,
            message: {
                _id: msg._id,
                senderId: msg.senderId,
                content: msg.content,
                timestamp: msg.timestamp,
                type: msg.type,
                name: msg.name,
                senderAvatar: msg.senderAvatar,
            }
        }));

        // ✅ Cập nhật tin nhắn cuối
        dispatch(updateLastMessage({
            conversationId: msg.conversationId,
            content: displayContent,
            timestamp: msg.timestamp,
            senderId: msg.senderId, // ✅ đúng luôn
        }));


    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        console.log("🛑 Đã huỷ lắng nghe receiveMessage");
    };

};
