import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft2, InfoCircle, Video } from 'iconsax-react-native';
import styles from '../../../../Css/chat';
import color from '../../../../Custom/Color';
import PinnedMessages from './component_ChatHeader/PinnedMessages';
import CallManager from './CallManager';

export default function ChatHeader({ user, navigation, pinnedMessages, onScrollToMessage, otherUserIds,currentUserDetail, }: any) {
  // Tạo ref nhận callback gọi video từ CallManager
  const callManagerRef = useRef<() => void | null>(() => {});

  // Nút gọi video trong ChatHeader sẽ gọi handleVideoCall từ CallManager
  const onCallPress = () => {
    if (callManagerRef.current) {
      callManagerRef.current();
    } else {
      console.warn('CallManager chưa sẵn sàng');
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
          <TouchableOpacity onPress={onCallPress}>
            <Video size={26} color={color.orange} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Rightbar', {
                conversationId: user.conversationId,
                isGroup: user.isGroup,
              })
            }
          >
            <InfoCircle size={26} color={color.orange} />
          </TouchableOpacity>
        </View>
      </View>

      <PinnedMessages
        pinnedMessages={pinnedMessages}
        onScrollToMessage={onScrollToMessage}
        conversationId={user.conversationId}
      />

      {/* Gọi CallManager, truyền ref để nhận callback */}
     <CallManager
        otherUserIds={otherUserIds}
        calleeName={user.firstname || user.username}
        currentUserDetail={currentUserDetail}   // truyền user detail
        onCallRef={callManagerRef}
        navigation={navigation}  // truyền navigation nếu cần
      />
    </View>
  );
}
