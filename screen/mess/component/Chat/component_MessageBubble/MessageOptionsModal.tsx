import React, { useState } from 'react';
import { Modal, Pressable, Text, View, useWindowDimensions, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage, getPinnedMessagesByConversation, revokeMessage } from '../../../../../store/chatSlice';
import color from '../../../../../Custom/Color';
import { showNotification } from '../../../../../Custom/notification';

export default function MessageOptionsModal({
    isVisible,
    position,
    isMine,
    onClose,
    messageId,
    conversationId,
    senderId,
    socket,
}: {
    isVisible: boolean;
    position: { x: number; y: number };
    isMine: boolean;
    onClose: () => void;
    messageId: string;
    conversationId: string;
    senderId:string;
    socket: any;
}) {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const pinnedMessages = useSelector((state: any) =>
        getPinnedMessagesByConversation(state, conversationId)
    );
    const [showOptions, setShowOptions] = useState(false);
    
    const handleOption = (action: 'delete' | 'revoke') => {
        setShowOptions(false);
        const payload = {
          messageId:messageId,
          conversationId,
          senderId: senderId,
        };
        if (action === 'delete') {
          socket.emit('deleteMessage', payload);
        } else if (action === 'revoke') {
          socket.emit('revokeMessage', payload);
        }
      };


    const handlePin = () => {
        if (pinnedMessages.length >= 3) {
         
            showNotification("You can only pin up to 3 messages in a conversation.", "warning");
            onClose();
            return;
        }

        socket.emit("pinMessage", { conversationId, messageId });
        onClose();
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <Pressable style={{ flex: 1 }} onPress={onClose}>
                <View
                    style={{
                        position: 'absolute',
                        top: position.y,
                        left: Math.min(Math.max(position.x - 160, 10), width - 180),
                        backgroundColor: '#1e2b38',
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        elevation: 5,
                    }}
                >
                    {/* ✅ Ghim tin nhắn – ai cũng có quyền ghim */}
                    <Text style={optionStyle} onPress={handlePin}>
                        Pin Message
                    </Text>

                    {/* ✅ Chỉ người gửi được delete/revoke */}
                    {isMine && (
                        <>
                            <Text style={optionStyle} onPress={() => handleOption('delete')}>
                                Delete Message
                            </Text>
                            <Text style={optionStyle} onPress={() => handleOption('revoke')}>
                                Revoke Message
                            </Text>
                        </>
                    )}
                </View>
            </Pressable>
        </Modal>
    );
}

const optionStyle = {
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
};
