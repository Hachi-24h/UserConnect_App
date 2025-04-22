import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SearchNormal, ArrowRight2 } from 'iconsax-react-native';

import BASE_URL from '../../config/IpAddress';
import { showNotification } from '../../Custom/notification';
import Footer from '../other/Footer';

type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  conversationId: string | null;
  timestamp?: string;
};

const MessHome = ({navigation}:any) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state: any) => state.user);
  const userId = user?._id;
  const token = user?.token;


  useEffect(() => {
    if (userId && token) fetchUsers();
  }, [userId]);

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
      const res = await axios.get(`${BASE_URL}:3000/chat/conversations/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let formatted = res.data.map((conversation: any) => {
        const other = conversation.members.find((m: any) =>
          (m.userId || m._id)?.toString() !== userId.toString()
        );
        
        const lastMsg = conversation.messages?.[conversation.messages.length - 1];

        if (!other || (!other.userId && !other._id)) return null;

        return {
          _id: other.userId || other._id,
          avatar: other.avatar || 'https://placehold.co/100x100',
          username: other.name || `${other.firstname || ''} ${other.lastname || ''}`.trim(),
          lastMessage: lastMsg?.content || 'Nhấn để bắt đầu trò chuyện',
          timestamp: lastMsg?.timestamp
            ? new Date(lastMsg.timestamp).toLocaleTimeString()
            : '',
          conversationId: conversation._id,
        };
      }).filter(Boolean);

      if (formatted.length === 0) {
        const followRes = await axios.get(`${BASE_URL}:3000/follow/followings/${userId}`, {
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

  // const handleUserPress = async (user: UserItem) => {
  //   try {
  //     if (user.conversationId) {
  //       navigation.navigate('Chat', { user });
  //     } else {
  //       console.log('id user đang login:\n', userId);
  //       console.log('id user đang nhấn:\n', user._id);
  //       console.log('token :  \n', token);
  //       console.log('thông tin user đc nhắn tin :\n', user);
  //       const res = await axios.post(`${BASE_URL}:3000/chat/conversations/private`, {
  //         senderId: userId,
  //         receiverId: user._id,
  //       }, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  
  //       const conversationId = res.data._id;
       
  //       showNotification("tạo cuộc trò chuyện thành công ","success");
  //       // navigation.navigate('Chat', {
          
  //       //   user: { ...user, conversationId }
  //       // });
  //     }
  //   } catch (err) {
  //     console.error('❌ Lỗi tạo cuộc trò chuyện:', err);
  //     Alert.alert('Lỗi', 'Không thể tạo cuộc trò chuyện');
  //   }
  // };
  
  const handleUserPress = async (user: UserItem) => {
    try {
      let conversationId = user.conversationId;
  
      if (!conversationId) {
        const res = await axios.post(`${BASE_URL}:3000/chat/conversations/private`, {
          user1: userId,
          user2: user._id,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        conversationId = res.data._id;
      }
  
      // GỌI API CHUẨN: /users/user-details/:userId
      const detailRes = await axios.get(`${BASE_URL}:3000/users/user-details/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const detail = detailRes.data?.data;
  
      const fullUserInfo = {
        _id: user._id,
        conversationId,
        avatar: detail.avatar,
        firstname: detail.firstname,
        lastname: detail.lastname,
        username: `${detail.firstname} ${detail.lastname}`,
      };
      console.log('thông tin user đc nhắn tin :\n', fullUserInfo);
      navigation.navigate('Chat', { user: fullUserInfo });
  
    } catch (err) {
      console.error('❌ Lỗi khi tạo cuộc trò chuyện hoặc lấy user detail:', err);
      Alert.alert('Lỗi', 'Không thể mở cuộc trò chuyện');
    }
  };
  

  const renderItem = ({ item }: { item: UserItem }) => (
    console.log("item là: ", item),
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleUserPress(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.time}>{item.timestamp}</Text>
        </View>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.lastMessage}>{item.lastMessage}</Text>
          {/* <Icon name="chevron-forward" size={16} color="#aaa" /> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        {/* <Icon name="search" size={20} color="#888" /> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  lastMessage: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  noResult: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MessHome;
