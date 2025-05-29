import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft2, InfoCircle, SearchNormal1, Video } from 'iconsax-react-native';
import styles from '../../../../Css/mess/chat';
import color from '../../../../Custom/Color';
import PinnedMessages from './component_ChatHeader/PinnedMessages';
import CallManager from './component_ChatHeader/CallManager';
import MessageSearchModal from './component_ChatHeader/MessageSearchModal';

export default function ChatHeader({ user, navigation, pinnedMessages, onScrollToMessage, otherUserIds, currentUserDetail, setHighlightedMsgId, }: any) {
  // Tạo ref nhận callback gọi video từ CallManager
  const callManagerRef = useRef<() => void | null>(() => { });
  const [showSearchModal, setShowSearchModal] = useState(false);
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
          <TouchableOpacity onPress={() => setShowSearchModal(true)}>
            <SearchNormal1 size={26} color={color.orange} />
          </TouchableOpacity>

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
      {showSearchModal && (
        <MessageSearchModal
          conversationId={user.conversationId}
          onClose={() => {
            setShowSearchModal(false);
            setHighlightedMsgId(null); // hoặc '' nếu mặc định bạn xài chuỗi
          }} 
          onScrollToMessage={(msgId: string) => {
            onScrollToMessage?.(msgId);
          }}
          setHighlightedMsgId={setHighlightedMsgId} // ✅ THÊM DÒNG NÀY
        />
      )}

    </View>
  );
}
