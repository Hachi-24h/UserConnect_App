import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import UserList from './component/UserList';
import styles from "../../Css/mess/MessHome";
import Footer from '../other/Footer';
import { resetUnreadCount } from '../../store/unreadSlice';
import { getToken } from '../../utils/token';
import MessHomeHeader from './component/MessHomeHeader';
import CreateGroupModal from './component/CreateGroupModal';
import socket from '../../socket/socket';
type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  timestamp?: string;
  conversationId: string | null;
  lastMessageSenderId?: string;
  isGroup: boolean; // ✅ ok
};

const MessHome = ({ navigation }: any) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const user = useSelector((state: any) => state.user);
  const conversations = useSelector((state: any) => state.chat.conversations);
  const unreadCounts = useSelector((state: any) => state.unread);
  const userLoginId = user?._id;
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);


  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
      // console.log("✅ Token lấy được từ async storage:", storedToken);
    };
    fetchToken();
  }, []);
  // console.log("token : ", token);
  useEffect(() => {
    if (!conversations || conversations.length === 0) return;

    const filteredConvs = conversations.filter(
      (conv: any) =>
        conv.isGroup || (conv.lastMessage && conv.lastMessage.trim() !== '')
    );
    const result = filteredConvs.map((conv: any) => {
      const isGroup = conv.isGroup;
      const lastMessage = conv.lastMessage || "Tap to start chatting";
      console.log("cuộc trò chuyện  : ", conv);
      console.log("------------------------------------\n" );
      let displayName = "Không rõ";
      let avatar = 'https://placehold.co/100x100';
      
      if (isGroup) {
        displayName = conv.groupName || "Nhóm không tên";
        avatar = conv.avatar || 'https://placehold.co/100x100';
      } else if (conv.otherUser) {
        displayName = conv.otherUser.name || "Không rõ";
        avatar = conv.otherUser.avatar || 'https://placehold.co/100x100';
      }

      return {
        _id: conv._id,
        avatar,
        username: displayName,
        lastMessage,
        timestamp: conv.updatedAt,
        conversationId: conv._id,
        lastMessageSenderId: conv.lastMessageSenderId || null,
        isGroup,
      };
    });

    setUsers(result);
    setFilteredUsers(result);
  }, [conversations]);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u: UserItem) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const handleUserPress = async (user: UserItem) => {
    try {
      const conversationId = user.conversationId;
      const isGroup = user.username?.startsWith("Nhóm") || user.username?.includes("Ông");
      
      if (conversationId) {
        //@ts-ignore
        dispatch(resetUnreadCount(userLoginId, conversationId, token));
      }

      const fullUserInfo = {
        userChatId: isGroup ? '' : user._id,
        conversationId,
        avatar: user.avatar,
        firstname: '',
        lastname: '',
        username: user.username,
        isGroup,
      };

      navigation.navigate('Chat', { user: fullUserInfo });
    } catch (err) {
      console.error('❌ Lỗi khi mở cuộc trò chuyện:', err);
    }
  };

  return (
    <View style={styles.container}>
      <MessHomeHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onCreateGroup={() => setShowCreateModal(true)}
      />

      {filteredUsers.length === 0 ? (
        <Text style={styles.noResult}>Không có kết quả phù hợp</Text>
      ) : (
        <UserList
          users={filteredUsers}
          onUserPress={handleUserPress}
          unreadCounts={unreadCounts}
        />
      )}

      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUser={user}
        socket={socket}
      />

      <Footer navigation={navigation} />

    </View>
  );
};

export default MessHome;
