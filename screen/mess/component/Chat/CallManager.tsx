// CallManager.tsx
import React, { useEffect, useState, useCallback } from 'react';
import socketCall from '../../../../socket/socketCall';
import CallModal from './CallModal';
import IncomingCallModal from './IncomingCallModal';
import { useSelector } from 'react-redux';

interface IncomingCallData {
  fromUserId: string;
  fromName: string;
}

interface CallManagerProps {
  otherUserIds: string[];
  calleeName: string;
  // Expose callback gọi video ra ngoài
  onCallRef?: React.MutableRefObject<() => void | null>;
}

export default function CallManager({ otherUserIds, calleeName, onCallRef }: CallManagerProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState<null | IncomingCallData>(null);
  const currentUser = useSelector((state: any) => state.user);

  useEffect(() => {
    socketCall.connect();
    socketCall.emit('join', { userId: currentUser._id });

    socketCall.on('incomingCall', (data: IncomingCallData & { toUserId: string }) => {
      if (data.toUserId === currentUser._id) {
        console.log('📞 Cuộc gọi đến:', data);
        setIncomingCall(data);
      }
    });

    socketCall.on('callDeclined', () => {
      setIsCalling(false);
    });

    socketCall.on('callAccepted', () => {
      setIsCalling(false);
      // TODO: mở giao diện gọi video nếu cần
    });

    socketCall.on('callEnded', () => {
      setIncomingCall(null);
    });

    return () => {
      socketCall.off('incomingCall');
      socketCall.off('callDeclined');
      socketCall.off('callAccepted');
      socketCall.off('callEnded');
    };
  }, [currentUser._id]);

  const handleVideoCall = useCallback(() => {
    if (otherUserIds.length === 0) {
      console.warn('Không có người nhận cuộc gọi');
      return;
    }
    setIsCalling(true);
    otherUserIds.forEach((id) => {
      socketCall.emit('incomingCall', {
        fromUserId: currentUser._id,
        fromName: currentUser.firstname || currentUser.username,
        toUserId: id,
      });
    });
    console.log('📞 Đang gọi video đến các ID:', otherUserIds);
  }, [currentUser._id, currentUser.firstname, currentUser.username, otherUserIds]);

  // Nếu truyền ref ra ngoài để ChatHeader có thể gọi handleVideoCall
  useEffect(() => {
    if (onCallRef) {
      onCallRef.current = handleVideoCall;
      return () => {
        if (onCallRef.current === handleVideoCall) {
          onCallRef.current = () => {};
        }
      };
    }
  }, [handleVideoCall, onCallRef]);

  const handleAccept = () => {
    if (!incomingCall) return;
    socketCall.emit('callAccepted', { toUserId: incomingCall.fromUserId });
    setIncomingCall(null);
    // TODO: mở giao diện gọi video nếu cần
  };

  const handleDecline = () => {
    if (!incomingCall) return;
    socketCall.emit('declineCall', {
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
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}
