import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ChatHeaderInfo from './component_rightBar/ChatHeaderInfo';
import MemberList from './component_rightBar/MemberList';
import MediaSection from './component_rightBar/MediaSection';
import OptionsSection from './component_rightBar/OptionsSection';


const Rightbar = ({ route }: any) => {
  const { conversationId } = route.params;

  const conversation = useSelector((state: any) =>
    state.chat.conversations.find((c: any) => c._id === conversationId)
  );
  console.log("Conversation data:", conversation);

  if (!conversation) return <Text style={{ color: 'white' }}>Loading...</Text>;

  const isGroup = conversation.isGroup;
  const avatar = isGroup ? conversation.avatar : conversation.otherUser?.avatar;
  const name = isGroup ? conversation.groupName : conversation.otherUser?.name;
  const memberCount = conversation.members?.length || 0;

  // Lấy currentUserId từ redux user hoặc auth
  const user = useSelector((state: any) => state.user);
  const currentUserId = user?._id;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      {/* ✅ Phần 1: Thông tin đầu */}
      <ChatHeaderInfo
        avatar={avatar}
        name={name}
        isGroup={isGroup}
        memberCount={memberCount}
      />

      {/* ✅ Phần 2: Danh sách thành viên (chỉ nhóm) */}
      {isGroup && (
        <MemberList
          members={conversation.members}
          adminId={conversation.adminId}
        />
      )}

      {/* ✅ Phần 3: Media chia sẻ */}
      <MediaSection conversationId={conversationId} />

      {/* ✅ Phần 4: Tuỳ chọn */}
      <OptionsSection
        isGroup={isGroup}
        conversationId={conversationId}
        currentUserId={currentUserId} // 👈 lấy từ redux user hoặc auth
        adminId={conversation.adminId}
      />
    </ScrollView>
  );
};

export default Rightbar;
