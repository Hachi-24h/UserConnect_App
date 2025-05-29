import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export default function CallModal({
  visible,
  calleeName,
  onCancel
}: {
  visible: boolean;
  calleeName: string;
  onCancel: () => void;
}) {
  const soundRef = useRef<Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Phát tiếng chuông
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

      // Bắt đầu timer 20s tự hủy cuộc gọi
      timerRef.current = setTimeout(() => {
        stopAndReleaseSound();
        onCancel();
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

  const handleCancel = () => {
    clearTimer();
    stopAndReleaseSound();
    onCancel();
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
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: '80%'
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            📞 Calling loudly {calleeName}
          </Text>
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
