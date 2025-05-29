import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Send, Gallery, Document, CloseCircle } from "iconsax-react-native";
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import styles from "../../../../Css/mess/chat";
import color from '../../../../Custom/Color';
import socket from '../../../../socket/socket';

export default function MessageInput({
  inputText,
  setInputText,
  conversationId,
  senderId,
  name,
  avatar,
}: any) {
  const [attachedFile, setAttachedFile] = useState<null | {
    type: 'image' | 'file';
    content: string;
    fileName: string;
    fileType: string;
  }>(null);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const granted = await requestPermission();
    if (!granted) return;

    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setAttachedFile({
          type: 'image',
          content: `data:${asset.type};base64,${asset.base64}`,
          fileName: asset.fileName || 'photo.jpg',
          fileType: asset.type || 'image/jpeg',
        });
      }
    });
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });
      const filePath = res.uri.replace('file://', '');
      const base64 = await RNFS.readFile(filePath, 'base64');

      setAttachedFile({
        type: 'file',
        content: `data:${res.type};base64,${base64}`,
        fileName: res.name || 'unknown_file',
        fileType: res.type || 'application/octet-stream',
      });
      
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) console.error(err);
    }
  };

  const handleSend = () => {
    console.log('Đã bấm gửi');
    if (!inputText.trim() && !attachedFile) return;

    const messagePayload: any = {
      conversationId,
      senderId,
      timestamp: new Date().toISOString(),
      name,
      senderAvatar: avatar,
    };

    if (attachedFile) {
      messagePayload.type = attachedFile.type;
      messagePayload.content = attachedFile.content;
      messagePayload.fileName = attachedFile.fileName;
      messagePayload.fileType = attachedFile.fileType;
    } else {
      messagePayload.type = 'text';
      messagePayload.content = inputText.trim();
    }

    socket.emit('sendMessage', messagePayload);
    setInputText('');
    setAttachedFile(null);
  };

  return (
    <View>
      {attachedFile && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 5 }}>
          {attachedFile.type === 'image' ? (
            <Image
              source={{ uri: attachedFile.content }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />
          ) : (
            <Text style={{ flex: 1, color: '#444' }}>{attachedFile.fileName}</Text>
          )}
          <TouchableOpacity onPress={() => setAttachedFile(null)} style={{ marginLeft: 10 }}>
            <CloseCircle size={22} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Gallery size={22} color={color.accentBlue} style={{ marginRight: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickFile}>
          <Document size={22} color={color.accentBlue} style={{ marginRight: 8 }} />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Send a message..."
          placeholderTextColor={color.textSecondary}
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity onPress={handleSend}>
          <Send size={24} color={color.accentBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}