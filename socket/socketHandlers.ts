import socket from './socket';

import { addMessage, deleteMessage, getConversationById, revokeMessage, updateLastMessage } from '../store/chatSlice';
import { playNotificationSound } from '../Custom/soundPlayer';
import { setConversations } from '../store/chatSlice';
import { showNotification } from '../Custom/notification';
import { useSelector } from 'react-redux';
import store from '../store/store';

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
    // console.log("🔁 Đã tham gia tất cả các phòng hội thoại");

    // lắng nghe sự kiện nhận tin nhắn
    const handleReceiveMessage = (msg: Message) => {
        console.log("tin nhắn: ",msg);
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
        // Join the socket room
        socket.emit("joinRoom", conv._id);

        // Update Redux state
        dispatch((dispatchFn: any, getState: any) => {
            const { chat, user } = getState();
            const updated = [...chat.conversations, conv];
            dispatch(setConversations(updated));

            // Determine if current user is the creator
            const isCreator = conv.adminId === user._id;

            // Set toast message
            setToastMsg({
                name: conv.groupName || 'New Group',
                content: isCreator
                    ? `You created a new group: ${conv.groupName || 'Unnamed'}`
                    : "You have been added to a group",
                senderAvatar: conv.avatar || '',
                timestamp: new Date().toISOString(),
            });

            setToastVisible(true);
        });
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
        const { chat, } = store.getState();
        if (removedUserId !== userId) // Không phải mình thì bỏ qua
        {
            const updatedConversations = chat.conversations.map((conv: any) => {
                if (conv._id !== conversationId) return conv;
                const updatedMembers = conv.members?.filter((m: any) => m.userId !== removedUserId);
                return { ...conv, members: updatedMembers };
            });
            dispatch(setConversations(updatedConversations));
        }
        else {


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
        }
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

    // lắng nghe sự kiện rời nhóm 
    const handleMemberLeft = (data: { conversationId: string; userId: string }) => {
        const { conversationId, userId: leftUserId } = data;

        const { chat } = store.getState();
        if (leftUserId !== userId) {
            const updatedConversations = chat.conversations.map((conv: any) => {
                if (conv._id !== conversationId) return conv;
                const updatedMembers = conv.members?.filter((m: any) => m.userId !== leftUserId);
                return { ...conv, members: updatedMembers };
            });
            dispatch(setConversations(updatedConversations));
        }
        else {
            console.log("👋 Bạn đã rời khỏi nhóm:", conversationId);
            // ✅ Truy cập state an toàn, không dùng useSelector
            const { chat } = store.getState();
            const targetConv = chat.conversations.find((conv: any) => conv._id === conversationId);
            const groupName = targetConv?.groupName || "Unknown Group";

            const updated = chat.conversations.filter((conv: any) => conv._id !== conversationId);
            dispatch(setConversations(updated));

            showNotification(`You left the group "${groupName}"`, "info");
        }
    };

    // lắng nghe sự kiện thêm  thành viên
    const handleMembersUpdated = (data: { conversationId: string; newMembers: any[] }) => {
        const { conversationId, newMembers } = data;
        const { chat } = store.getState();

        const updatedConversations = chat.conversations.map((conv: any) => {
            if (conv._id !== conversationId) return conv;

            const updatedMembers = [...(conv.members || []), ...newMembers];

            // Lọc trùng nếu cần (tuỳ backend đã xử lý chưa)
            const uniqueMembers = Array.from(
                new Map(updatedMembers.map(m => [m.userId, m])).values()
            );

            return {
                ...conv,
                members: uniqueMembers,
            };
        });
 
        dispatch(setConversations(updatedConversations));
    };

    // Lắng nghe khi có tin nhắn được ghim

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newConversation", handleNewConversation);
    socket.on("groupDisbanded", handleGroupDisbanded);
    socket.on("memberRemoved", handleMemberRemoved);
    socket.on("messageRevoked", handleMessageRevoked);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("memberLeft", handleMemberLeft);
    socket.on("memberAdded", handleMembersUpdated);

    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("newConversation", handleNewConversation);
        socket.off("groupDisbanded", handleGroupDisbanded);
        socket.off("memberRemoved", handleMemberRemoved);
        socket.off("messageRevoked", handleMessageRevoked);
        socket.off("messageDeleted", handleMessageDeleted);
        socket.off("memberLeft", handleMemberLeft);
        socket.off("memberAddedg", handleMembersUpdated);
        // console.log("🛑 Đã huỷ lắng nghe các sự kiện ");

    };

};
