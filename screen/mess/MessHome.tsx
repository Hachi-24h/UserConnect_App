import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increaseUnread } from '../../store/unreadSlice';
import socket from '../../socket/socket';
import ip from '../../config/IpAddress';
const BASE_URL = ip.BASE_URL;
import UserList from './component/UserList'; // Import UserList component

import styles from "../../Css/mess/MessHome";
import Footer from '../other/Footer';
import { useFocusEffect } from '@react-navigation/native'; // Thêm vào đây

import { resetUnreadCount } from '../../store/unreadSlice';

type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  timestamp?: string;
  conversationId: string | null;
  lastMessageSenderId?: string;
};

const MessHome = ({ navigation }: any) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const user = useSelector((state: any) => state.user);
  const unreadCounts = useSelector((state: any) => state.unread);

  const userLoginId = user?._id;
  const token = user?.token;
  const dispatch = useDispatch();


  useFocusEffect(
    React.useCallback(() => {
      fetchUsers(); // chỉ gọi API, không socket, không listener
    }, [userLoginId])
  );

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
  
      const res = await axios.get(`${BASE_URL}/chat/conversations/all/${userLoginId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const uniqueMap = new Map();
  
      const fetchUserDetailTasks = res.data.map(async (conversation:any) => {
        const isGroup = conversation.isGroup;
        const lastMsg = conversation.messages?.[conversation.messages.length - 1];
        const lastSenderId = lastMsg?.senderId;
  
        if (isGroup) {
          let senderName = "Không rõ";
  
          // Nếu có người gửi cuối
          if (lastSenderId) {
            try {
              const senderRes = await axios.get(`${BASE_URL}/users/user-details/${lastSenderId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const sender = senderRes.data?.data;
              senderName = `${sender.firstname || ''} ${sender.lastname || ''}`.trim();
            } catch (error) {
              console.error(`❌ Không lấy được thông tin người gửi nhóm:`, (error as any).message);
            }
          }
  
          if (!uniqueMap.has(conversation._id)) {
            uniqueMap.set(conversation._id, {
              _id: conversation._id,
              avatar: conversation.avatar || 'https://placehold.co/100x100',
              username: conversation.groupName || 'Nhóm không tên',
              lastMessage: lastMsg?.content
                ? `${senderName}: ${lastMsg.content}`
                : 'Bắt đầu trò chuyện nhóm',
              timestamp: lastMsg?.timestamp
                ? new Date(lastMsg.timestamp).toLocaleTimeString()
                : '',
              conversationId: conversation._id,
              lastMessageSenderId: lastSenderId || '',
            });
          }
        } else {
          const other = conversation.members.find((m:any) =>
            (m.userId || m._id)?.toString() !== userLoginId.toString()
          );
  
          if (!other || (!other.userId && !other._id)) return;
  
          const otherId = other.userId || other._id;
  
          try {
            const detailRes = await axios.get(`${BASE_URL}/users/user-details/${otherId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
  
            const detail = detailRes.data?.data;
            const isMe = lastSenderId === userLoginId;
            const senderName = isMe ? "Bạn" : `${detail.firstname} ${detail.lastname}`.trim();
  
            if (!uniqueMap.has(otherId)) {
              uniqueMap.set(otherId, {
                _id: otherId,
                avatar: detail.avatar || other.avatar || 'https://placehold.co/100x100',
                username: `${detail.firstname || ''} ${detail.lastname || ''}`.trim(),
                lastMessage: lastMsg?.content
                  ? `${senderName}: ${lastMsg.content}`
                  : 'Nhấn để bắt đầu trò chuyện',
                timestamp: lastMsg?.timestamp
                  ? new Date(lastMsg.timestamp).toLocaleTimeString()
                  : '',
                conversationId: conversation._id,
                lastMessageSenderId: lastSenderId || '',
              });
            }
          } catch (error) {
            console.error(`❌ Không lấy được user ${otherId}:`, (error as any).message);
          }
        }
      });
  
      await Promise.all(fetchUserDetailTasks);
  
      let formatted = Array.from(uniqueMap.values());
      console.log("📩 MessHome danh sách người dùng (có nhóm & cá nhân):", formatted);
  
      if (formatted.length === 0) {
        const followRes = await axios.get(`${BASE_URL}/follow/followings/${userLoginId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        formatted = followRes.data.data.map((item:any) => ({
          _id: item.user._id,
          avatar: item.user.avatar || 'https://placehold.co/100x100',
          username: `${item.user.firstname} ${item.user.lastname}`.trim(),
          lastMessage: 'Bạn đã theo dõi người này',
          timestamp: new Date(item.createdAt).toLocaleTimeString(),
          conversationId: null,
        }));
      }
  
      setUsers(formatted);
      setFilteredUsers(formatted);
    } catch (error) {
      console.error('❌ Lỗi lấy dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  // useEffect(() => {
  //   if (userLoginId && token) fetchUsers();
  // }, [userLoginId, token]);

  const handleUserPress = async (user: UserItem) => {
    try {
      let conversationId = user.conversationId;

      if (!conversationId) {
        const res = await axios.post(`${BASE_URL}/chat/conversations/private`, {
          user1: userLoginId,
          user2: user._id,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        conversationId = res.data._id;
      }

      if (conversationId) {
        //@ts-ignore
        dispatch(resetUnreadCount(userLoginId, conversationId, token));
      }
      const detailRes = await axios.get(`${BASE_URL}/users/user-details/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const detail = detailRes.data?.data;
      // console.log("📩 MessHome nhận chi tiết người dùng:", detail);
      const fullUserInfo = {
        userChatId: user._id,
        conversationId,
        avatar: detail.avatar,
        firstname: detail.firstname,
        lastname: detail.lastname,
        username: `${detail.firstname} ${detail.lastname}`,
      };
      navigation.navigate('Chat', { user: fullUserInfo });

    } catch (err) {
      console.error('❌ Lỗi khi tạo cuộc trò chuyện hoặc lấy user detail:', err);
      Alert.alert('Lỗi', 'Không thể mở cuộc trò chuyện');
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

      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : filteredUsers.length === 0 ? (
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
