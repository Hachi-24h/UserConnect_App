import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import Sound from 'react-native-sound';
import color from '../../../../Custom/Color';

Sound.setCategory('Playback');

export default function IncomingCallModal({ visible, callerName, callerAvatar, onAccept, onDecline }: any) {
  const soundRef = useRef<Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      const sound = new Sound(
        'https://res.cloudinary.com/df2amyjzw/video/upload/v1744890393/audiochuong_qdwihw.mp3',
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          sound.setNumberOfLoops(-1);
          sound.play();
        }
      );
      soundRef.current = sound;

      timerRef.current = setTimeout(() => {
        stopAndReleaseSound();
        onDecline(); // tự động từ chối cuộc gọi sau 20s
      }, 20000);
    } else {
      clearTimer();
      stopAndReleaseSound();
    }

    return () => {
      clearTimer();
      stopAndReleaseSound();
    };
  }, [visible]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopAndReleaseSound = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
    }
  };

  const handleAccept = () => {
    clearTimer();
    stopAndReleaseSound();
    onAccept();
  };

  const handleDecline = () => {
    clearTimer();
    stopAndReleaseSound();
    onDecline();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: color.white,
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: 280
        }}>
          {callerAvatar && (
            <Image
              source={{ uri: callerAvatar }}
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            📞 The call came from
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            {callerName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleDecline} style={{ marginHorizontal: 10 }}>
              <Text style={{ color: 'red', fontSize: 16 }}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAccept} style={{ marginHorizontal: 10 }}>
              <Text style={{ color: 'green', fontSize: 16 }}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
