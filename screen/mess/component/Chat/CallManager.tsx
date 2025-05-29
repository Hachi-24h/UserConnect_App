// CallManager.tsx
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
    navigation: any;  // Thêm navigation để điều hướng
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

        socketCall.on('callAccepted', (data: { fromUserId: string }) => {
          
                setIsCalling(false);

                // Mở màn hình VideoCall cho người gọi khi người nhận bấm Accept
                navigation.navigate('VideoCall', {
                    currentUserId: currentUser._id,
                    otherUserId: data.fromUserId,
                    socketCall,
                });
            
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
    }, [currentUser._id, isCalling, navigation, socketCall]);

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
                toUserId: id, // id
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
        socketCall.emit('callAccepted', { toUserId: incomingCall.fromUserId, fromUserId: currentUser._id });
        setIncomingCall(null);

        // Mở màn hình VideoCall cho người nhận
        navigation.navigate('VideoCall', {
            currentUserId: currentUser._id,
            otherUserId: incomingCall.fromUserId,
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
