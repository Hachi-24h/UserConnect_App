import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import UserList from './component/UserList';
import styles from "../../Css/mess/MessHome";
import Footer from '../other/Footer';
import { resetUnreadCount } from '../../store/unreadSlice';
import { getToken } from '../../utils/token';
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

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
      // console.log("✅ Token lấy được từ async storage:", storedToken);
    };
    fetchToken();
  }, []);
  console.log("token : ", token);
  useEffect(() => {
    if (!conversations || conversations.length === 0) return;

    const result = conversations.map((conv: any) => {

      const isGroup = conv.isGroup;
      
      const lastMessage = conv.lastMessage || "Nhấn để bắt đầu trò chuyện";

      let displayName = "Không rõ";
      let avatar = 'https://placehold.co/100x100';

      if (isGroup) {
        displayName = conv.groupName || "Nhóm không tên";
        avatar = conv.avatar || 'https://placehold.co/100x100';

      } else if (conv.otherUser) {
        displayName = conv.otherUser.name || "Không rõ";
        avatar = conv.otherUser.avatar || 'https://placehold.co/100x100';

      }
      console.log("thời gian tin nhắn cuối: ", conv.updatedAt);
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
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <Text style={styles.noResult}>Không có kết quả phù hợp</Text>
      ) : (
        <UserList
          users={filteredUsers}
          onUserPress={handleUserPress}
          unreadCounts={unreadCounts}
        />
      )}

      <Footer navigation={navigation} />

    </View>
  );
};

export default MessHome;
