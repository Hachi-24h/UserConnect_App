import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { showNotification } from '../../Custom/notification';

const { width, height } = Dimensions.get("window");

const NotificationDemoScreen = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'warning' | 'error'>('success');

  const [loading, setLoading] = useState(false);
  const handleSend = () => {
    showNotification(message || "This is a notification!", type);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Demo</Text>

      <TextInput
        placeholder="Enter your message"
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        {['success', 'warning', 'error'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.typeButton,
              type === item && { backgroundColor: '#333' }
            ]}
            onPress={() => setType(item as 'success' | 'warning' | 'error')}
          >
            <Text style={styles.typeText}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendText}>SHOW NOTIFICATION</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationDemoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: width * 0.05,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: height * 0.03,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
  },
  typeText: {
    color: '#fff',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
