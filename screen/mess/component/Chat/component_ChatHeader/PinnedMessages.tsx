// 📄 components/PinnedMessages.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowUp2, ArrowDown2, Trash, DocumentText } from "iconsax-react-native";
import socket from '../../../../../socket/socket';


export default function PinnedMessages({
  pinnedMessages = [],
  onScrollToMessage,
  onUnpinMessage,
  conversationId,
}: any) {
  const [showAllPinned, setShowAllPinned] = useState(false);
  const hasPinned = pinnedMessages.length > 0;

  const getFileName = (url: string): string => {
    const parts = decodeURIComponent(url).split('/chat_files/');
    return parts.length > 1 ? parts[1] : url.split('/').pop() || 'file';
  };

  const getFileIcon = (ext: string): any => {
    switch (ext) {
      case 'pdf': return require('../../../../../Icon/pdf.png');
      case 'ppt':
      case 'pptx': return require('../../../../../Icon/ppt.png');
      case 'txt': return require('../../../../../Icon/txt.png');
      case 'zip': return require('../../../../../Icon/zip.png');
      case 'doc':
      case 'docx': return require('../../../../../Icon/word.png');
      case 'xls':
      case 'xlsx': return require('../../../../../Icon/xls.png');
      default: return require('../../../../../Icon/zip.png');
    }
  };

  const handleUnpin = (messageId: string) => {
    if (!messageId || !conversationId) return;
    socket.emit("unpinMessage", { messageId, conversationId });
  };

  if (!hasPinned) return null;

  return (
    <View style={{
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

      {showAllPinned
        ? pinnedMessages.slice(0, 3).map((msg: any) => (
          <TouchableOpacity
            key={msg._id}
            onPress={() => onScrollToMessage && onScrollToMessage(msg._id)}
            style={{
              backgroundColor: '#2e3c4d',
              borderRadius: 8,
              marginTop: 6,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text
                style={{ color: '#ffa726', fontWeight: '600', fontStyle: 'italic' }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {msg.name || 'Người gửi'}:
              </Text>

              {msg.type === 'file' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Image
                    source={getFileIcon(msg.content?.split('.').pop() || '')}
                    style={{ width: 20, height: 20, marginRight: 6 }}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ color: '#fff', fontStyle: 'italic' }}
                  >
                    {getFileName(msg.content)}
                  </Text>
                </View>
              ) : msg.type === 'image' ? (
                <Text style={{ color: '#fff', fontStyle: 'italic' }}>Pinned a picture</Text>
              ) : msg.type === 'audio' ? (
                <Text style={{ color: '#fff', fontStyle: 'italic' }}>Pinned a sound</Text>
              ) : (
                <Text
                  style={{ color: '#fff', fontStyle: 'italic' }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {msg.content}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleUnpin(msg._id)}>
              <Trash size={18} color="#ccc" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
        : (
          <TouchableOpacity
            onPress={() => onScrollToMessage && onScrollToMessage(pinnedMessages[0]._id)}
            style={{ marginTop: 4 }}
          >
            {pinnedMessages[0].type === 'file' ? (
              <Text style={{ color: '#ccc', fontStyle: 'italic' }}>{pinnedMessages[0]?.fileName}</Text>
            ) : pinnedMessages[0].type === 'image' ? (
              <Text style={{ color: '#ccc', fontStyle: 'italic' }}>Pinned a picture</Text>
            ) : pinnedMessages[0].type === 'audio' ? (
              <Text style={{ color: '#ccc', fontStyle: 'italic' }}>Pinned a sound</Text>
            ) : (
              <Text
                style={{ color: '#ccc', fontStyle: 'italic' }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {pinnedMessages[0]?.content}
              </Text>
            )}
          </TouchableOpacity>
        )
      }
    </View>
  );
}
