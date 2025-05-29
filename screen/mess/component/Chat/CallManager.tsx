// CallManager.tsx - Đã sửa
import React, { useEffect, useState, useCallback } from 'react';
import socketCall from '../../../../socket/socketCall';
import CallModal from './CallModal';
import IncomingCallModal from './IncomingCallModal';
import { useSelector } from 'react-redux';

interface IncomingCallData {
    fromUserId: string;
    fromName: string;
    fromAvatar?: string;
    toUserId: string;
}

interface CallManagerProps {
    otherUserIds: string[];
    calleeName: string;
    currentUserDetail: {
        _id: string;
        firstname?: string;
        lastname?: string;
        username?: string;
        avatar?: string;
    };
    navigation: any;
    onCallRef?: React.MutableRefObject<() => void | null>;
}

export default function CallManager({ otherUserIds, calleeName, currentUserDetail, navigation, onCallRef }: CallManagerProps) {
    const [isCalling, setIsCalling] = useState(false);
    const [incomingCall, setIncomingCall] = useState<null | IncomingCallData>(null);
    const currentUser = useSelector((state: any) => state.user);

    useEffect(() => {
        socketCall.connect();
        socketCall.emit('join', { userId: currentUser._id });

        socketCall.on('incomingCall', (data: IncomingCallData) => {
            if (data.toUserId === currentUser._id) {
                console.log('📞 Cuộc gọi đến:', data);
                setIncomingCall(data);
            }
        });

        socketCall.on('callDeclined', () => {
            setIsCalling(false);
        });

        // ✅ SỬA: Logic xử lý callAccepted cho người gọi
        socketCall.on('callAccepted', (data: { fromUserId: string; toUserId: string }) => {
            console.log('✅ Call accepted:', data);
            
            // Kiểm tra xem mình có phải là người gọi không
            if (data.toUserId === currentUser._id) {
                setIsCalling(false);

                // Mở màn hình VideoCall cho người gọi
                // otherUserId sẽ là ID của người nhận (người vừa accept)
                navigation.navigate('VideoCall', {
                    currentUserId: currentUser._id,
                    otherUserId: data.fromUserId, // Đây là ID của người nhận
                    socketCall,
                });
            }
        });

        socketCall.on('callEnded', () => {
            setIncomingCall(null);
            setIsCalling(false);
        });

        return () => {
            socketCall.off('incomingCall');
            socketCall.off('callDeclined');
            socketCall.off('callAccepted');
            socketCall.off('callEnded');
        };
    }, [currentUser._id, navigation]);

    const handleVideoCall = useCallback(() => {
        if (otherUserIds.length === 0) {
            console.warn('Không có người nhận cuộc gọi');
            return;
        }
        setIsCalling(true);
        otherUserIds.forEach((id) => {
            socketCall.emit('incomingCall', {
                fromUserId: currentUserDetail._id,
                fromName: `${currentUserDetail.firstname || ''} ${currentUserDetail.lastname || ''}`.trim() || currentUserDetail.username || 'No Name',
                fromAvatar: currentUserDetail.avatar,
                toUserId: currentUser._id,
            });
        });
        console.log('📞 Đang gọi video đến các ID:', otherUserIds);
    }, [currentUserDetail, otherUserIds]);

    useEffect(() => {
        if (onCallRef) {
            onCallRef.current = handleVideoCall;
            return () => {
                if (onCallRef.current === handleVideoCall) {
                    onCallRef.current = () => { };
                }
            };
        }
    }, [handleVideoCall, onCallRef]);

    const handleAccept = () => {
        if (!incomingCall) return;
        
        // ✅ SỬA: Gửi đúng thông tin khi accept
        socketCall.emit('callAccepted', { 
            fromUserId: currentUser._id,      // Người nhận (mình)
            toUserId: incomingCall.fromUserId // Người gọi
        });
        
        setIncomingCall(null);

        // Mở màn hình VideoCall cho người nhận
        navigation.navigate('VideoCall', {
            currentUserId: currentUser._id,
            otherUserId: incomingCall.fromUserId, // ID của người gọi
            socketCall,
        });
    };

    const handleDecline = () => {
        if (!incomingCall) return;
        socketCall.emit('callDeclined', {
            toUserId: incomingCall.fromUserId,
            fromUserId: currentUser._id,
            fromName: currentUser.firstname || currentUser.username,
        });
        setIncomingCall(null);
    };

    const handleCancelCall = () => {
        otherUserIds.forEach((id) => {
            socketCall.emit('endCall', { toUserId: id });
        });
        setIsCalling(false);
    };

    return (
        <>
            <CallModal visible={isCalling} calleeName={calleeName} onCancel={handleCancelCall} />
            <IncomingCallModal
                visible={!!incomingCall}
                callerName={incomingCall?.fromName}
                callerAvatar={incomingCall?.fromAvatar}
                onAccept={handleAccept}
                onDecline={handleDecline}
            />
        </>
    );
}