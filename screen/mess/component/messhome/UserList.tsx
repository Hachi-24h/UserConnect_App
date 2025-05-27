import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import styles from "../../../../Css/mess/MessHome";
import { useSelector } from 'react-redux';
import { getUserDetails } from '../../../../utils/auth';
import {formatMessageTime } from '../../../../Custom/timeFormatter';

type UserItem = {
  _id: string;
  avatar: string;
  username: string;
  lastMessage: string;
  isGroup: boolean;
  timestamp?: string;
  conversationId: string | null;
  lastMessageSenderId?: string;
};

interface UserListProps {
  users: UserItem[];
  onUserPress: (user: UserItem) => void;
  unreadCounts: { [key: string]: number };
}

const UserList: React.FC<UserListProps> = ({ users, onUserPress, unreadCounts }) => {
  const user = useSelector((state: any) => state.user);
  const userLoginId = user?._id;

  const [groupSenderNames, setGroupSenderNames] = useState<{ [id: string]: string }>({});

  

  // ✅ Fetch tên người gửi cuối trong nhóm nếu cần
  useEffect(() => {
    users.forEach((item) => {
      const senderId = item.lastMessageSenderId;
      if (
        item.isGroup &&
        senderId &&
        senderId !== userLoginId &&
        !groupSenderNames[senderId]
      ) {
        getUserDetails(senderId).then((user) => {
          if (user?.lastname || user?.firstname) {
            const name = `${user.lastname || ""} ${user.firstname || ""}`.trim();
            setGroupSenderNames((prev) => ({
              ...prev,
              [senderId]: name,
            }));
          }
        });
      }
    });
  }, [users, userLoginId]);

  const renderItem = ({ item }: { item: UserItem }) => {
    // console.log("thời gian tin nhắn cuối : ", item.timestamp);
    const conversationUnreadCount = item.conversationId ? unreadCounts[item.conversationId] || 0 : 0;
    const isGroup = item.isGroup;
    const isMyMessage = item.lastMessageSenderId === userLoginId;
    let displayMessage = "";
   const time2 = item.timestamp?.toString() || "2025-05-12T12:23:40.505Z";
   const time ="2 giờ"
   const timeline = formatMessageTime(time2);
  // console.log("thời gian hiển thị: ", timeline);




    if (isGroup) {
      if (isMyMessage) {
        displayMessage = `You: ${item.lastMessage}`;
      } else {
        const senderId = item.lastMessageSenderId || userLoginId;
        const senderName = groupSenderNames[senderId] || "  ";
        
        displayMessage = `${senderName.split(" ")[0]}: ${item.lastMessage}`;
      }
    } else {
      displayMessage = isMyMessage
        ? `You: ${item.lastMessage}`
        // : `${item.username.split(' ')[0]}: ${item.lastMessage}`;
        : ` ${item.lastMessage}`;

    }
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => onUserPress(item)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}> {timeline}</Text>
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
