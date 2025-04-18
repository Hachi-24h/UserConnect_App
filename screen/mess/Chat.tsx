import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { launchImageLibrary, MediaType } from "react-native-image-picker";
import {
  Send,
  Camera,
  EmojiHappy,
  ArrowLeft2,
  Call,
  Video,
  InfoCircle,
} from "iconsax-react-native";
import io from "socket.io-client";
import styles from "../../Css/chat";
import color from "../../Custom/Color";

const { width, height } = Dimensions.get("window");

const ChatScreen = ({ navigation, route }: any) => {
  // 👇 TODO: Truyền đúng từ route hoặc Redux
  const conversationId = route.params?.conversationId || "65f...abc";
  const senderId = route.params?.senderId || "660...xyz";

  const socket = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  // 👉 Kết nối socket khi load
  useEffect(() => {
    socket.current = io("http://localhost:5008", {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.current.on("receive_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // 👉 Hàm cuộn xuống cuối danh sách
  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 👉 Gửi tin nhắn văn bản
  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const message = {
      conversationId,
      senderId,
      content: inputText,
      type: "text",
      timestamp: new Date(),
    };

    socket.current.emit("send_message", message);

    setMessages((prev) => [
      ...prev,
      { ...message, sender: "me", id: Date.now().toString() },
    ]);
    setInputText("");
    scrollToBottom();
  };

  // 👉 Mở thư viện ảnh/video
  const openMediaLibrary = () => {
    const options = {
      mediaType: "mixed" as MediaType,
      selectionLimit: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      const message = {
        conversationId,
        senderId,
        content: asset.uri,
        type: asset.type?.startsWith("image") ? "image" : "video",
        timestamp: new Date(),
      };

      socket.current.emit("send_message", message);

      setMessages((prev) => [
        ...prev,
        { ...message, sender: "me", id: Date.now().toString() },
      ]);
      scrollToBottom();
    });
  };

  // 👉 Render từng tin nhắn
  const renderMessage = ({ item }: any) => {
    if (item.type === "text") {
      return (
        <View
          style={[
            styles.messageBubble,
            item.sender === "me" ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.mediaContainer,
            item.sender === "me" ? styles.myMedia : styles.otherMedia,
          ]}
        >
          <Image
            source={{ uri: item.content }}
            style={styles.media}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={28} color={color.orange} />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://picsum.photos/50" }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
            Nguyễn Minh Thuận
          </Text>
          <Text style={styles.statusText}>Hoạt động 1 giờ trước</Text>
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

      {/* Danh sách tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        style={styles.separator}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={openMediaLibrary}>
          <Camera size={24} color={color.gray} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nhắn tin..."
          placeholderTextColor={color.textSecondary}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.emojiButton}>
          <EmojiHappy size={24} color={color.gray} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.emojiButton, { marginLeft: width * 0.02 }]}
        >
          <Send size={24} color={color.accentBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
