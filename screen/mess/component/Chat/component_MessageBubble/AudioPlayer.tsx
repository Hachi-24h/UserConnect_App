import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import Sound from 'react-native-sound';

// ✅ Đảm bảo các icon đúng đường dẫn của bạn
const iconPlay = require('../../../../../Icon/play.png');
const iconPause = require('../../../../../Icon/pause.png');
const iconNext = require('../../../../../Icon/next.png');
const iconPrev = require('../../../../../Icon/previous.png');

Sound.setCategory('Playback');

export default function AudioPlayer({ uri }: { uri: string }) {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = () => {
    if (sound && isPlaying) {
      sound.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    const newSound = new Sound(uri, '', (error) => {
      if (error) {
        console.log('❌ Lỗi khi load âm thanh', error);
        setIsLoading(false);
        return;
      }

      setSound(newSound);
      newSound.play((success) => {
        setIsPlaying(false);
        if (success) {
          newSound.release();
        }
      });
      setIsPlaying(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Image source={iconPrev} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={togglePlay} style={styles.button}>
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Image
            source={isPlaying ? iconPause : iconPlay}
            style={styles.icon}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Image source={iconNext} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
