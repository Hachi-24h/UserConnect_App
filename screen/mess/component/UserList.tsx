import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from "../../../Css/mess/MessHome";


type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  timestamp?: string;
  conversationId: string | null;
  lastMessageSenderId?: string; // Có thể là string hoặc undefined
};

interface UserListProps {
  users: UserItem[];
  onUserPress: (user: UserItem) => void;
  unreadCounts: { [key: string]: number };
}

const UserList: React.FC<UserListProps> = ({ users, onUserPress, unreadCounts }) => {

  const renderItem = ({ item }: { item: UserItem }) => {
    const conversationUnreadCount = item.conversationId ? unreadCounts[item.conversationId] || 0 : 0;
    const displayMessage = item.lastMessage;

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => onUserPress(item)}>
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
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
    />
  );
};

export default UserList;
