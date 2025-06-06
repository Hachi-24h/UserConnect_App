import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import styles from '../../../../Css/mess/chat';
import color from '../../../../Custom/Color';
import socket from '../../../../socket/socket';
import { getUserDetails_user } from '../../../../utils/auth';
import {
  getCachedUserInfo,
  setCachedUserInfo,
} from '../../../../utils/userCache';
import AudioPlayer from './component_MessageBubble/AudioPlayer';
import MessageOptionsModal from './component_MessageBubble/MessageOptionsModal';
// import Video from 'react-native-video';

const downloadIcon = require('../../../../Icon/download.png');

const getExtension = (url: string): string => {
  const name = decodeURIComponent(url).split('?')[0].split('/').pop() || '';
  return name.split('.').pop()?.toLowerCase() || '';
};

const getFileIcon = (ext: string): any => {
  switch (ext) {
    case 'pdf':
      return require('../../../../Icon/pdf.png');
    case 'ppt':
    case 'pptx':
      return require('../../../../Icon/ppt.png');
    case 'txt':
      return require('../../../../Icon/txt.png');
    case 'zip':
      return require('../../../../Icon/zip.png');
    case 'doc':
    case 'docx':
      return require('../../../../Icon/word.png');
    case 'xls':
    case 'xlsx':
      return require('../../../../Icon/xls.png');
    default:
      return require('../../../../Icon/zip.png');
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
      }}>
      <Image
        source={icon}
        style={{ width: 40, height: 40, marginRight: 10 }}
        resizeMode="contain"
      />
      <View style={{ flexShrink: 1 }}>
        <Text
          style={{ color: '#000', fontSize: 14, marginBottom: 4 }}
          numberOfLines={2}>
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

export default function MessageBubble({
  message,
  isMine,
  isGroup,
  showAvatar,
  conversationId,
  highlightedMsgId,
}: any) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const isLeftIndent = isGroup && !isMine;

  const [name, setName] = useState<string>(message.name || '');
  const [avatar, setAvatar] = useState<string>(message.senderAvatar || '');
  const [showOptions, setShowOptions] = useState(false);
  const [pressPosition, setPressPosition] = useState({ x: 0, y: 0 });




  useEffect(() => {
    const fetchUserInfo = async () => {
      if (name && avatar) {
        return;
      }

      const cached = getCachedUserInfo(message.senderId);
      if (cached) {
        setName(cached.name);
        setAvatar(cached.avatar);
        return;
      }

      const userInfo = await getUserDetails_user(message.senderId)

      if (userInfo) {
        const userName =
          userInfo.firstname + ' ' + userInfo.lastname || 'Unknown User';
        const userAvatar =
          userInfo.avatar ||
          'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg';
        setName(userName);
        setAvatar(userAvatar);
        setCachedUserInfo(message.senderId, {
          name: userName,
          avatar: userAvatar,
        });
      }
    };

    fetchUserInfo();
  }, [message.senderId]);

  return (
    <TouchableOpacity
      onPressIn={e => {
        const { pageX, pageY } = e.nativeEvent;
        setPressPosition({ x: pageX, y: pageY });
      }}
      onLongPress={() => setShowOptions(true)}>
      <View
        style={{
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        {isLeftIndent && (
          <View style={{ width: 40, marginRight: 8 }}>
            {showAvatar && avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            ) : null}
          </View>
        )}

        <View style={{ flex: 1 }}>
          {isLeftIndent && showAvatar && (
            <Text
              style={{
                marginBottom: 2,
                fontWeight: 'bold',
                color: 'white',
                fontSize: 12,
              }}>
              {name}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'column',
              alignItems: isMine ? 'flex-end' : 'flex-start',
            }}>
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.otherMessage,
                {
                  backgroundColor:
                    message._id === highlightedMsgId
                      ? '#f1c40f' // Màu vàng nổi bật khi tìm được
                      : isMine
                        ? color.accentBlue
                        : color.gray,
                  borderRadius: 10,
                  maxWidth: '80%',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                },
              ]}>
              {
                message.type === 'audio' ? (
                  <AudioPlayer uri={message.content} />
                ) : message.type === 'image' ? (
                  <Image
                    source={{ uri: message.content }}
                    style={{ width: 200, height: 200, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : message.type === 'file' ? (
                  <FileMessage url={message.content} />
                ) : (
                  <Text style={{ color: isMine ? 'white' : 'black' }}>
                    {message.content}
                  </Text>
                )}
            </View>

            <Text
              style={{
                fontSize: 10,
                color: '#aaa',
                marginTop: 2,
                marginLeft: isMine ? 0 : 4,
                marginRight: isMine ? 4 : 0,
              }}>
              {time}
            </Text>
          </View>
        </View>

        {/* 👇 Modal định vị theo tọa độ nhấn giữ */}
        <MessageOptionsModal
          isVisible={showOptions}
          position={pressPosition}
          isMine={isMine}
          onClose={() => setShowOptions(false)}
          messageId={message._id}
          senderId={message.senderId}
          conversationId={conversationId}
          socket={socket}
        />
      </View>
    </TouchableOpacity>
  );
}
