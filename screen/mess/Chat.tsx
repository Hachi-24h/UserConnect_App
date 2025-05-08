import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft2,
  Send,
  Call,
  Video,
  InfoCircle,
} from "iconsax-react-native";
import styles from "../../Css/chat";
import socket from "../../socket/socket";
import color from "../../Custom/Color";
import { getMessages } from "../../socket/chatApi";
import { resetUnread } from "../../store/unreadSlice";
import { addMessage, setMessages } from "../../store/chatSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { selectMessagesByConversation } from '../../store/chatSelectors';
const { width } = Dimensions.get("window");

// ===================== Types =====================
interface UserChat {
  avatar: string;
  conversationId: string;
  firstname: string;
  lastname: string;
  username: string;
  userChatId: string;
}

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  timestamp: string;
  type: string;
  name?: string;
  senderAvatar?: string;
}

interface RootState {
  user: any;
  chat: {
    messagesByConversation: { [key: string]: Message[] };
  };
}

// ===================== Component =====================
const ChatScreen = ({ navigation }: any) => {
  const route = useRoute<RouteProp<Record<string, { user: UserChat }>, string>>();
  const { user } = route.params;

  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const conversationId = user.conversationId;

  const messages = useSelector(selectMessagesByConversation(conversationId));

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (conversationId) {
      dispatch(resetUnread(conversationId));
      dispatch({
        type: "userDetail/setCurrentConversationId",
        payload: conversationId,
      });
    }
  }, [conversationId]);
  useEffect(() => {
    return () => {
      dispatch({
        type: "userDetail/setCurrentConversationId",
        payload: null,
      });
    };
  }, []);
    

  useEffect(() => {
    socket.emit("joinRoom", conversationId);
    fetchMessages();

    socket.on("receiveMessage", (msg: Message) => {
      dispatch(addMessage({ conversationId, message: msg }));
      scrollToBottom();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const res: Message[] = await getMessages(conversationId, currentUser.token);
      dispatch(setMessages({ conversationId, messages: res }));
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

    const msg: Message = {
      conversationId,
      senderId: currentUser._id,
      receiverId: user.userChatId,
      content: inputText,
      timestamp: new Date().toISOString(),
      type: "text",
      name: `${currentUser.firstname} ${currentUser.lastname}`,
      senderAvatar: currentUser.avatar,
    };

    socket.emit("sendMessage", msg);

    setInputText("");
    scrollToBottom();
  };

  const renderMessage = ({ item }: { item: Message }) => {
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
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.firstname} {user.lastname}
          </Text>
          <Text style={styles.statusText}>Hoạt động gần đây</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Call size={26} color={color.orange} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Video size={26} color={color.orange} />
          </TouchableOpacity>
          <TouchableOpacity>
            <InfoCircle size={26} color={color.orange} />
          </TouchableOpacity>
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
