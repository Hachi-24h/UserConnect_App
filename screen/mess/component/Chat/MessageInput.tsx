import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Send, Gallery, Document } from 'iconsax-react-native';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import socket from '../../../../socket/socket';
import styles from '../../../../Css/chat';
import color from '../../../../Custom/Color';
import BlobUtil from 'react-native-blob-util';

export default function MessageInput({
  inputText,
  setInputText,
  handleSendText,
  conversationId,
  senderId,
}: any) {
  const sendSocketMessage = (payload: any) => {
    socket.emit('sendMessage', payload);
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleSendImage = async () => {
    const granted = await requestPermission();
    if (!granted) return Alert.alert('Thiếu quyền', 'Không có quyền truy cập ảnh.');

    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel || !response.assets) return;

      const img = response.assets[0];
      console.log("📷 Ảnh chọn:", img);

      if (!img.base64 || !img.type) return Alert.alert('Lỗi', 'Không thể gửi ảnh này');

      const payload = {
        conversationId,
        senderId,
        type: 'image',
        content: `data:${img.type};base64,${img.base64}`,
        fileName: img.fileName || 'image.jpg',
        fileType: img.type,
        timestamp: new Date().toISOString(),
      };

      sendSocketMessage(payload);
    });
  };
  
  const handleSendFile = async () => {
    try {
      const file = await DocumentPicker.pickSingle({ type: DocumentPicker.types.allFiles });
      console.log("📁 File chọn:", file);
  
      const stat = await BlobUtil.fs.stat(file.uri); // ✅ Convert content:// -> real path
      const base64 = await BlobUtil.fs.readFile(stat.path, 'base64');
  
      const payload = {
        conversationId,
        senderId,
        type: 'file',
        content: `data:${file.type};base64,${base64}`,
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date().toISOString(),
      };
  
      socket.emit("sendMessage", payload);
    } catch (err: any) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert("Lỗi", "Không thể gửi file này");
      }
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={handleSendImage} style={{ marginHorizontal: 5 }}>
        <Gallery size={22} color={color.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSendFile} style={{ marginHorizontal: 5 }}>
        <Document size={22} color={color.textPrimary} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nhắn gì đó..."
        placeholderTextColor={color.textSecondary}
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity onPress={handleSendText}>
        <Send size={24} color={color.accentBlue} />
      </TouchableOpacity>
    </View>
  );
}
