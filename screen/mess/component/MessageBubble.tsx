import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import styles from "../../../Css/chat";
import color from '../../../Custom/Color';

// ✅ icon tải xuống
const downloadIcon = require('../../../Icon/download.png');

const getExtension = (url: string): string => {
    const name = decodeURIComponent(url).split('?')[0].split('/').pop() || '';
    return name.split('.').pop()?.toLowerCase() || '';
};

// ✅ mapping icon theo phần mở rộng
const getFileIcon = (ext: string): any => {
    switch (ext) {
        case 'pdf':
            return require('../../../Icon/pdf.png');
        case 'ppt':
        case 'pptx':
            return require('../../../Icon/ppt.png');
        case 'txt':
            return require('../../../Icon/txt.png');
        case 'zip':
            return require('../../../Icon/zip.png');
        case 'doc':
        case 'docx':
        case 'word':
            return require('../../../Icon/word.png');
        case 'xls':
        case 'xlsx':
            return require('../../../Icon/xls.png');
        default:
            return require('../../../Icon/zip.png');
    }
};

// ✅ lấy tên file từ đường dẫn Cloudinary (sau /chat_files/)
const getFileName = (url: string): string => {
    const parts = decodeURIComponent(url).split('/chat_files/');
    return parts.length > 1 ? parts[1] : url.split('/').pop() || 'file';
};

const FileMessage = ({ url }: { url: string }) => {
  const fileName = getFileName(url);
  const ext = getExtension(fileName);
  const icon = getFileIcon(ext);

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        maxWidth: 240,
      }}
    >
      <Image
        source={icon}
        style={{ width: 40, height: 40, marginRight: 10 }}
        resizeMode="contain"
      />
      <View style={{ flexShrink: 1 }}>
        <Text
          style={{
            color: '#000',
            fontSize: 14,
            marginBottom: 4,
            flexShrink: 1,
          }}
          numberOfLines={2}
        >
          {fileName}
        </Text>
        <Image
          source={downloadIcon}
          style={{ width: 16, height: 16 }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};



export default function MessageBubble({ message, isMine, isGroup }: any) {
    return (
        <View style={{ marginVertical: 4 }}>
            {!isMine && isGroup && message.name && (
                <Text style={{ marginLeft: 8, fontWeight: "bold", color: "white" }}>
                    {message.name}
                </Text>
            )}
            <View
                style={[
                    styles.messageBubble,
                    isMine ? styles.myMessage : styles.otherMessage,
                    {
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        backgroundColor: isMine ? color.accentBlue : color.gray,
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: "80%",
                        marginTop: 2,
                    },
                ]}
            >
                {message.type === "image" ? (
                    <Image
                        source={{ uri: message.content }}
                        style={{ width: 200, height: 200, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                ) : message.type === "file" ? (
                    <FileMessage url={message.content} />
                ) : (
                    <Text style={{ color: isMine ? "white" : "black" }}>
                        {message.content}
                    </Text>
                )}
            </View>
        </View>
    );
}
