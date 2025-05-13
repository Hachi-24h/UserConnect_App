import Sound from 'react-native-sound';

// BẮT BUỘC: Cho phép phát sound kể cả khi app ở chế độ silent
Sound.setCategory('Playback'); // Android cần dòng này

export const playNotificationSound = (): void => {
  const sound = new Sound('noti02.mp3', Sound.MAIN_BUNDLE, (error: Error | null) => {
    if (error) {
      console.log('❌ Lỗi load âm thanh:', error.message);
      return;
    }

    sound.play((success: boolean) => {
      if (!success) {
        console.log('❌ Lỗi phát âm thanh');
      }
      sound.release();
    });
  });
};
