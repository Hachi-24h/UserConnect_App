import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../../Css/messhome';
import { useNavigation } from '@react-navigation/native';
import  BASE_URL from '../../config/IpAddress';
import socket from '../../socket/socket';
import { showNotification } from '../../Custom/notification';

const MessHome = ({navigation}:any) => {
  type UserItem = {
    _id: string;
    avatar: string;
    username: string;
    lastMessage: string;
    conversationId: string;
  };
  const [users, setUsers] = useState<UserItem[]>([]);
  
  const user = useSelector((state: any) => state.user);
  const userId = user._id;
  const token = user.token;

  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<any>({});

  useEffect(() => {
    fetchUsers();
    fetchUnreadCounts();

    socket.on("receiveMessage", (msg) => {
      if (msg.senderId !== userId) {
        showNotification(`📩 Tin nhắn mới từ ${msg.name || 'ai đó'}: ${msg.content}`, "warning");
        fetchUsers();
        fetchUnreadCounts();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}:3000/chat/conversations/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = response.data.map((conversation: any) => {
        const other = conversation.members.find((m: any) => m.userId !== userId);
        const lastMessage = conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : 'Nhấn để bắt đầu trò chuyện';
        return {
          _id: other.userId,
          firstname: other.name.split(' ')[0],
          lastname: other.name.split(' ')[1] || '',
          avatar: other.avatar,
          username: other.name,
          lastMessage,
          conversationId: conversation._id,
        };
      });

      setUsers(formatted);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng đã chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}:3000/chat/messages/unread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCounts(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy số tin chưa đọc:", error);
    }
  };

  const handleUserPress = async (userItem: any) => {
    try {
      await axios.post(`${BASE_URL}:3000/chat/messages/unread/reset`, {
        userId: userId,
        conversationId: userItem.conversationId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("❌ Lỗi reset unread:", err);
    }

    (navigation as any).navigate('Chat', {
      conversationId: userItem.conversationId,
      otherUser: userItem,
    });
    
  };

  const renderItem = ({ item }: any) => {
    const unread = unreadCounts[item.conversationId] || 0;
    return (
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text numberOfLines={1} style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default MessHome;