import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft2, Call, Video, InfoCircle, Trash, DocumentText, ArrowUp2, ArrowDown2 } from "iconsax-react-native";
import styles from "../../../../Css/chat";
import color from '../../../../Custom/Color';

export default function ChatHeader({ user, navigation, pinnedMessages = [], onUnpinMessage, onScrollToMessage }: any) {
  const [showAllPinned, setShowAllPinned] = useState(false);
  const hasPinned = pinnedMessages.length > 0;
  const getFileName = (url: string): string => {
    const parts = decodeURIComponent(url).split('/chat_files/');
    return parts.length > 1 ? parts[1] : url.split('/').pop() || 'file';
  };
  const getFileIcon = (ext: string): any => {
    console.log("getFileIcon called with ext:", ext);
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
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={28} color={color.orange} />
        </TouchableOpacity>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.firstname || user.username} {user.lastname || ''}
          </Text>
          <Text style={styles.statusText}>Recent Activity</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Call size={26} color={color.orange} /></TouchableOpacity>
          <TouchableOpacity><Video size={26} color={color.orange} /></TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Rightbar', {
              conversationId: user.conversationId,
              isGroup: user.isGroup
            })}
          >
            <InfoCircle size={26} color={color.orange} />
          </TouchableOpacity>
        </View>
      </View>

      {hasPinned && (
        <View
          style={{
            backgroundColor: '#1f2a38',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomColor: '#333',
            borderBottomWidth: 1,
          }}>
          <TouchableOpacity
            onPress={() => setShowAllPinned(!showAllPinned)}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ color: '#ffa726', fontWeight: 'bold' }}>
              📌 {showAllPinned ? 'Message Pinned' : `${pinnedMessages.length} Message Pinned`}
            </Text>
            {showAllPinned ? (
              <ArrowUp2 size={18} color="#ffa726" />
            ) : (
              <ArrowDown2 size={18} color="#ffa726" />
            )}
          </TouchableOpacity>

          {showAllPinned ? (
            pinnedMessages.slice(0, 3).map((msg: any) => (
              <TouchableOpacity
                key={msg._id}
                onPress={() => onScrollToMessage && onScrollToMessage(msg._id)}
                style={{
                  backgroundColor: '#2e3c4d',
                  borderRadius: 8,
                  marginTop: 6,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                  <Text style={{ color: '#ffa726', fontWeight: '600', fontStyle: 'italic' }}>{msg.name || 'Người gửi'}:</Text>
                  {msg.type === 'file' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Image
                        source={getFileIcon(msg.content?.split('.').pop() || '')}
                        style={{ width: 20, height: 20, marginRight: 6 }}
                      />
                      <Text numberOfLines={1} style={{ color: '#fff', fontStyle: 'italic' }}>{getFileName(msg.content) || 'Tập tin đính kèm'}</Text>
                    </View>
                  ) : (
                    <Text style={{ color: '#fff', fontStyle: 'italic' }}>{msg.content}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => onUnpinMessage && onUnpinMessage(msg._id)}>
                  <Trash size={18} color="#ccc" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              onPress={() => onScrollToMessage && onScrollToMessage(pinnedMessages[0]._id)}
              style={{ marginTop: 4 }}>
              {pinnedMessages[0].type === 'file' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  
                  <Text style={{ color: '#ccc', fontStyle: 'italic' }}>{pinnedMessages[0]?.fileName || 'Tập tin đính kèm'}</Text>
                </View>
              ) : (
                <Text style={{ color: '#ccc', fontStyle: 'italic' }}>{pinnedMessages[0]?.content}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
