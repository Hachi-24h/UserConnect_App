import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increaseUnread } from '../../store/unreadSlice';
import socket from '../../socket/socket';
import  BASE_URL  from '../../config/IpAddress';

import styles from "../../Css/mess/MessHome";
import Footer from '../other/Footer';

type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  conversationId: string | null;
  lastMessageSenderId?: string;
  timestamp?: string;
};

const MessHome = ({ navigation }: any) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state: any) => state.user);
  const unreadCounts = useSelector((state: any) => state.unread);

  const userLoginId = user?._id;
  const token = user?.token;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userLoginId && token) fetchUsers();
  }, [userLoginId, token]);

  useEffect(() => {
    if (userLoginId) {
      socket.emit("joinRoom", userLoginId); //  SAI Ở ĐÂY , IDROOM 
      console.log("🔗 MessHome joined room với id:", userLoginId);
    }
  }, [userLoginId]);


  

  useEffect(() => {
    if (!userLoginId) return;
  
    const handleReceiveMessage = (msg: any) => {
      console.log("📩 MessHome nhận realtime:", msg); // Log tin nhắn nhận được
  
      console.log("Receiver ID:", msg.receiverId); // In ID người nhận từ tin nhắn
      console.log("User Login ID:", userLoginId);  // In ID của user đang đăng nhập
  
      // Kiểm tra nếu tin nhắn đến từ user khác và thuộc conversation của login user
      if (msg.receiverId === userLoginId) {
        dispatch(increaseUnread(msg.conversationId));  // Cập nhật unread trong Redux
        fetchUsers();  // Cập nhật lại danh sách và tin nhắn cuối
      } else {
        console.log("Tin nhắn không dành cho người dùng này.");
      }
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);  // Cleanup khi component unmount
    };
  }, [userLoginId, dispatch]);
  

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) =>
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
      console.log("🔗 MessHome lấy danh sách cuộc trò chuyện:", res.data);
      (res.data as any[]).forEach((conversation) => {
        const other = conversation.members.find((m: any) =>
          (m.userId || m._id)?.toString() !== userLoginId.toString()
        );

        if (!other || (!other.userId && !other._id)) return;

        const otherId = other.userId || other._id;
        const lastMsg = conversation.messages?.[conversation.messages.length - 1];

        if (!uniqueMap.has(otherId)) {
          uniqueMap.set(otherId, {
            _id: otherId,
            avatar: other.avatar || 'https://placehold.co/100x100',
            username: other.name || `${other.firstname || ''} ${other.lastname || ''}`.trim(),
            lastMessage: lastMsg?.content || 'Nhấn để bắt đầu trò chuyện',
            timestamp: lastMsg?.timestamp
              ? new Date(lastMsg.timestamp).toLocaleTimeString()
              : '',
            conversationId: conversation._id,
            lastMessageSenderId: lastMsg?.senderId || '',
          });
        }
      });

      let formatted = Array.from(uniqueMap.values());

      if (formatted.length === 0) {
        const followRes = await axios.get(`${BASE_URL}/follow/followings/${userLoginId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        formatted = followRes.data.data.map((item: any) => ({
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
    } catch (error: any) {
      console.error('❌ Lỗi lấy dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

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

      const detailRes = await axios.get(`${BASE_URL}/users/user-details/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const detail = detailRes.data?.data;

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

  const renderItem = ({ item }: { item: UserItem }) => {
    const isSentByMe = item.lastMessage?.startsWith("Bạn:") || false;
    const conversationUnreadCount = item.conversationId ? unreadCounts[item.conversationId] || 0 : 0;

    let displayMessage = item.lastMessage;
    if (item.conversationId && item.lastMessage) {
      const senderId = item.lastMessageSenderId || '';
      if (senderId === userLoginId) {
        displayMessage = `Bạn: ${item.lastMessage}`;
      } else {
        displayMessage = `${item.username}: ${item.lastMessage}`;
      }
    }

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleUserPress(item)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {displayMessage}
            </Text>
            {item.conversationId && conversationUnreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{conversationUnreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <Footer navigation={navigation} />
    </View>
  );
};

export default MessHome;
