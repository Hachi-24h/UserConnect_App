import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ChatHeaderInfo from './component_rightBar/ChatHeaderInfo';
import MemberList from './component_rightBar/MemberList';
import MediaSection from './component_rightBar/MediaSection';
import OptionsSection from './component_rightBar/OptionsSection';
import color from '../../../../Custom/Color';
import socket from '../../../../socket/socket';
import { useNavigation } from '@react-navigation/native';

const RightBar = ({ route, navigation }: any) => {
  const { conversationId } = route.params;



  const conversation = useSelector((state: any) =>
    state.chat.conversations.find((c: any) => c._id === conversationId)
  );

  const user = useSelector((state: any) => state.user);
  const currentUserId = user?._id;


  useEffect(() => {
    if (!conversation) {
      navigation.navigate("MessHome");
    }
  }, [conversation]);
  if (!conversation) return null;
  const isGroup = conversation.isGroup;
  const avatar = isGroup ? conversation.avatar : conversation.otherUser?.avatar;
  const name = isGroup ? conversation.groupName : conversation.otherUser?.name;
  const memberCount = conversation.members?.length || 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      {/* Thông tin đầu */}
      <ChatHeaderInfo
        avatar={avatar}
        name={name}
        isGroup={isGroup}
        memberCount={memberCount}
      />

      <View style={{ height: 1, backgroundColor: color.gray, margin: 5, marginBottom: 20 }} />

      {/* Danh sách thành viên (luôn render an toàn) */}
      <MemberList
        members={conversation.members}
        adminId={conversation.adminId}
        currentUserId={currentUserId}
        conversationId={conversationId}
        socket={socket}
      />

      <View style={{ height: 1, backgroundColor: color.gray, margin: 5, marginBottom: 20 }} />

      {/* Media đã chia sẻ */}
      <MediaSection conversationId={conversationId} />

      <View style={{ height: 1, backgroundColor: color.gray, margin: 5, marginBottom: 20 }} />

      {/* Tuỳ chọn khác */}
      <OptionsSection
        isGroup={isGroup}
        conversationId={conversationId}
        currentUserId={currentUserId}
        adminId={conversation.adminId}
        navigation={navigation}
      />
    </ScrollView>
  );
};

export default RightBar;
