import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styles from "../../Css/MessHome";
import { SearchNormal1, Add, ScanBarcode } from "iconsax-react-native";
import color from "../../Custom/Color";
import Footer from "../other/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../../config/IpAddress";

// 👇 Kiểu cho user
type UserItem = {
  _id: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  username: string;
};

const MessHome = ({ navigation }: any) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state: any) => state.user.token);
  const userDetail = useSelector((state: any) => state.userDetail);
  const userId = userDetail?.userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const linkapi = `${BASE_URL}:3000/users/top10-users?excludeUserId=${userId}`;
        console.log("Fetching top 10 users from:", linkapi);
        const response = await axios.get(linkapi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUsers();
    }
  }, [userId, token]);

  const handleUserPress = async (otherUser: UserItem) => {
    try {
      const linkapi = `${BASE_URL}:3000/chat/conversations/private`;
      console.log("Creating conversation with:", linkapi);
      const res = await axios.post(
        linkapi,
        {
          user1: userId,
          user2: otherUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const conversationId = res.data._id;
      navigation.navigate("Chat", { conversationId });
    } catch (err) {
      console.error("❌ Failed to start chat:", err);
    }
  };
  
  const renderItem = ({ item }: { item: UserItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleUserPress(item)}
    >
      <Image
        source={{ uri: item.avatar || "https://example.com/default-avatar.png" }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.username} numberOfLines={1}>
          {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          Nhấn để bắt đầu trò chuyện
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchNormal1 size={20} color={color.white} />
        <TextInput
          placeholder="Tìm kiếm người dùng"
          placeholderTextColor={color.gray}
          style={styles.searchInput}
        />
        <ScanBarcode size={20} color={color.white} />
        <Add size={20} color={color.white} style={{ marginLeft: 10 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={color.white} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Footer navigation={navigation} />
    </View>
  );
};

export default MessHome;
