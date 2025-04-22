import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity, Image, Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import {
  ArrowLeft2, Send, Camera, EmojiHappy, Call, Video, InfoCircle
} from "iconsax-react-native";
import styles from "../../Css/chat";
import socket from "../../socket/socket";
import color from "../../Custom/Color";
import { getMessages } from "../../socket/chatApi";
import { useDispatch } from 'react-redux';
import { resetUnread } from '../../store/unreadSlice';


const { width } = Dimensions.get("window");

const ChatScreen = ({ navigation, route }: any) => {
  const { user } = route.params;

  const currentUser = useSelector((state: any) => state.user);
  const token = currentUser.token;

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const otherUser = user;
  const conversationId= user.conversationId ;
  console.log("conversationId là: ", conversationId);
  console.log(" user nhận đc là: \n", otherUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetUnread(user.conversationId)); // 🔥 reset ngay khi mở
    fetchMessages();
  }, []);

  useEffect(() => {
    dispatch({ type: 'userDetail/setCurrentConversationId', payload: user.conversationId });
  }, []);
  
  useEffect(() => {
    socket.emit("joinRoom", conversationId);
    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(conversationId, token);
      // console.log("📩 Danh sách tin nhắn nhận được:", res);
      setMessages(res);
      scrollToBottom();
    } catch (error) {
      console.error("❌ Lỗi lấy tin nhắn:", error);
    }
  };
  
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const msg = {
      conversationId,
      senderId: currentUser._id,
      content: inputText,
      type: "text",
      timestamp: new Date().toISOString(),
      isDeleted: false,
      isPinned: false,
      name: `${currentUser.firstname} ${currentUser.lastname}`,
      senderAvatar: currentUser.avatar,
    };

    socket.emit("sendMessage", msg);
    setInputText("");
  };

  const renderMessage = ({ item }: any) => {
    const isMine = item.senderId?.toString() === currentUser._id?.toString();
    return (
      <View
        style={[
          styles.messageBubble,
          isMine ? styles.myMessage : styles.otherMessage,
          {
            alignSelf: isMine ? "flex-end" : "flex-start",
            backgroundColor: isMine ? color.accentBlue : color.gray,
            marginVertical: 4,
            padding: 10,
            borderRadius: 10,
            maxWidth: "80%",
          },
        ]}
      >
        <Text style={{ color: isMine ? "white" : "black" }}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={28} color={color.orange} />
        </TouchableOpacity>
        <Image source={{ uri: otherUser?.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {otherUser.firstname} {otherUser.lastname}
          </Text>
          <Text style={styles.statusText}>Hoạt động gần đây</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity><Call size={26} color={color.orange} /></TouchableOpacity>
          <TouchableOpacity><Video size={26} color={color.orange} /></TouchableOpacity>
          <TouchableOpacity><InfoCircle size={26} color={color.orange} /></TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhắn gì đó..."
          placeholderTextColor={color.textSecondary}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={handleSend}>
          <Send size={24} color={color.accentBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
