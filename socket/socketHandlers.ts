import socket from './socket';

import { addMessage, deleteMessage, revokeMessage, updateLastMessage } from '../store/chatSlice';
import { playNotificationSound } from '../Custom/soundPlayer';
import { setConversations } from '../store/chatSlice';
import { showNotification } from '../Custom/notification';

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

    // lắng nghe sự kiện nhận tin nhắn
    const handleReceiveMessage = (msg: Message) => {
        const isSender = msg.senderId === userId;
        const isActive = msg.conversationId === currentConversationId;

        let displayContent = msg.content;
        if (msg.type === "image") {
            displayContent = "Sent a new picture";
        } else if (msg.type === "file") {
            displayContent = "Sent a new file";
        }

        // ✅ Chỉ thông báo nếu KHÔNG phải là người gửi & không đang ở phòng đó
        if (!isSender && !isActive) {
            playNotificationSound();
            setToastMsg({
                name: msg.name,
                content: displayContent,
                senderAvatar: msg.senderAvatar,
                timestamp: msg.timestamp,
            });
            setToastVisible(true);
        }

        // ✅ Luôn cập nhật Redux, kể cả là mình gửi từ thiết bị khác
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

        dispatch(updateLastMessage({
            conversationId: msg.conversationId,
            content: displayContent,
            timestamp: msg.timestamp,
            senderId: msg.senderId,
        }));
    };
    // lắng nghe sự kiện tạo nhóm mới
    const handleNewConversation = (conv: any) => {
        // console.log("📥 Nhận nhóm mới:", conv);

        // 🚪 Tham gia room ngay lập tức
        socket.emit("joinRoom", conv._id);

        // ✅ Cập nhật Redux: thêm vào danh sách hội thoại
        dispatch((dispatchFn: any, getState: any) => {
            const { chat } = getState();
            const updated = [...chat.conversations, conv];
            dispatch(setConversations(updated));
        });

        // (Tuỳ chọn) Thông báo toast
        setToastMsg({
            name: conv.groupName || 'New Group',
            content: "You have been added to a group",
            senderAvatar: conv.avatar || '',
            timestamp: new Date().toISOString(),
        });
        setToastVisible(true);
    };
    // lắng nghe sự kiện nhóm bị giải tán
    const handleGroupDisbanded = (data: { conversationId: string; groupName: string }) => {
        const { conversationId, groupName } = data;
        // console.log("💥 Nhóm bị giải tán:", groupName, conversationId);

        // Xoá nhóm khỏi Redux
        dispatch((dispatchFn: any, getState: any) => {
            const { chat } = getState();
            const updated = chat.conversations.filter((conv: any) => conv._id !== conversationId);
            dispatch(setConversations(updated));
        });

        // Thông báo toast
        showNotification(`Group <<${groupName}>> has been disbanded`, "success");
        // setToastVisible(true);
    };

    // lắng nghe sự kiện thành viên bị xoá khỏi nhóm
    const handleMemberRemoved = (data: { conversationId: string; userId: string }) => {
        const { conversationId, userId: removedUserId } = data;

        if (removedUserId !== userId) return; // Không phải mình thì bỏ qua

        console.log("🚫 Bạn đã bị kick khỏi nhóm:", conversationId);

        // Lấy tên nhóm từ Redux trước khi xoá
        let groupName = "Unknown Group";

        dispatch((dispatchFn: any, getState: any) => {
            const { chat } = getState();
            const targetConv = chat.conversations.find((conv: any) => conv._id === conversationId);
            groupName = targetConv?.groupName || "Unknown Group";

            const updated = chat.conversations.filter((conv: any) => conv._id !== conversationId);
            dispatch(setConversations(updated));
        });

        // ✅ Thông báo
        showNotification(`You have been removed from the group "${groupName}"`, "error");
    };

    // lắng nghe sự kiện thu hồi tin nhắn
    const handleMessageRevoked = (data: { messageId: string; conversationId: string }) => {
        dispatch(revokeMessage({
            messageId: data.messageId,
            conversationId: data.conversationId,
        }));
    };

    // lắng nghe sự kiện xoá tin nhắn
    const handleMessageDeleted = (data: { conversationId: string; messageId: string }) => {
        const { conversationId, messageId } = data;

        console.log("🗑️ Tin nhắn đã bị xoá:", messageId);

        dispatch(deleteMessage({ conversationId, messageId }));

        // (tuỳ chọn) showNotification hoặc toast
        // showNotification("A message has been deleted", "info");
    };


    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newConversation", handleNewConversation);
    socket.on("groupDisbanded", handleGroupDisbanded);
    socket.on("memberRemoved", handleMemberRemoved);
    socket.on("messageRevoked", handleMessageRevoked);
    socket.on("messageDeleted", handleMessageDeleted);
    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("newConversation", handleNewConversation);
        socket.off("groupDisbanded", handleGroupDisbanded);
        socket.off("memberRemoved", handleMemberRemoved);
        socket.off("messageRevoked", handleMessageRevoked);
        socket.off("messageDeleted", handleMessageDeleted);
        console.log("🛑 Đã huỷ lắng nghe các sự kiện ");

    };

};
