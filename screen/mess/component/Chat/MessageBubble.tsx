import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import styles from "../../../../Css/chat";
import color from '../../../../Custom/Color';
import { selectMembersByConversationId } from '../../../../store/chatSelectors';

const downloadIcon = require('../../../../Icon/download.png');

const getExtension = (url: string): string => {
  const name = decodeURIComponent(url).split('?')[0].split('/').pop() || '';
  return name.split('.').pop()?.toLowerCase() || '';
};

const getFileIcon = (ext: string): any => {
  switch (ext) {
    case 'pdf': return require('../../../../Icon/pdf.png');
    case 'ppt':
    case 'pptx': return require('../../../../Icon/ppt.png');
    case 'txt': return require('../../../../Icon/txt.png');
    case 'zip': return require('../../../../Icon/zip.png');
    case 'doc':
    case 'docx': return require('../../../../Icon/word.png');
    case 'xls':
    case 'xlsx': return require('../../../../Icon/xls.png');
    default: return require('../../../../Icon/zip.png');
  }
};

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
      <Image source={icon} style={{ width: 40, height: 40, marginRight: 10 }} resizeMode="contain" />
      <View style={{ flexShrink: 1 }}>
        <Text style={{ color: '#000', fontSize: 14, marginBottom: 4 }} numberOfLines={2}>
          {fileName}
        </Text>
        <Image source={downloadIcon} style={{ width: 16, height: 16 }} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

export default function MessageBubble({ message, isMine, isGroup, showAvatar, conversationId }: any) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const members = useSelector(selectMembersByConversationId(conversationId));
  const sender = members.find((m: any) => m.userId === message.senderId);
  const senderAvatar = sender?.avatar || 'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg';
  const senderName = sender?.name || 'Người dùng';
  const isLeftIndent = isGroup && !isMine;

  return (
    <View style={{ paddingVertical: 4, flexDirection: 'row', alignItems: 'flex-start' }}>
      {isLeftIndent && (
        <View style={{ width: 40, marginRight: 8 }}>
          {showAvatar ? (
            <Image
              source={{ uri: senderAvatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : null}
        </View>
      )}

      <View style={{ flex: 1 }}>
        {isLeftIndent && showAvatar && (
          <Text style={{ marginBottom: 2, fontWeight: "bold", color: 'white', fontSize: 12 }}>
            {senderName}
          </Text>
        )}

        <View style={{
          flexDirection: 'column',
          alignItems: isMine ? 'flex-end' : 'flex-start',
       
        }}>
          <View
            style={[
              styles.messageBubble,
              isMine ? styles.myMessage : styles.otherMessage,
              {
                backgroundColor: isMine ? color.accentBlue : color.gray,
                borderRadius: 10,
                maxWidth: '80%',
                paddingVertical: 6,
                paddingHorizontal: 10,
              },
            ]}
          >
            {message.type === 'image' ? (
              <Image
                source={{ uri: message.content }}
                style={{ width: 200, height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
            ) : message.type === 'file' ? (
              <FileMessage url={message.content} />
            ) : (
              <Text style={{ color: isMine ? 'white' : 'black' }}>{message.content}</Text>
            )}
          </View>

          <Text
            style={{
              fontSize: 10,
              color: '#aaa',
              marginTop: 2,
              marginLeft: isMine ? 0 : 4,
              marginRight: isMine ? 4 : 0,
            }}
          >
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
}
