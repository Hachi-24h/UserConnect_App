import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Modal, Animated } from 'react-native';

const CustomToast = ({ visible, onHide, msg }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current; // bắt đầu ở trên cao
  
  useEffect(() => {
    if (visible) {
      // Chạy cả fade + slide cùng lúc
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        onHide();
      }, 2000); // hiển thị trong 2s

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Image source={{ uri: msg.senderAvatar }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{msg.name}</Text>
            <Text style={styles.content} numberOfLines={1}>
              {msg.content}
            </Text>
          </View>
          <Text style={styles.time}>
            {new Date(msg.timestamp).toLocaleTimeString().slice(0, 5)}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    zIndex: 999,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
});

export default CustomToast;
