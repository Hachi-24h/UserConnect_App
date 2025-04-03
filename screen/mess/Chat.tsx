import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image, Dimensions,
} from "react-native";
import { launchImageLibrary, MediaType } from "react-native-image-picker"; // ✅ Đảm bảo MediaType được import
import { Send, Camera, EmojiHappy, ArrowLeft2, Call, Video, InfoCircle } from "iconsax-react-native";
import styles from "../../Css/chat";
import color from "../../Custom/Color";

import chatHistory from "../../Custom/data"
const { width, height } = Dimensions.get("window");
const ChatScreen = ({ navigation }: any) => {
  const [messages, setMessages] = useState(chatHistory)

  const [inputText, setInputText] = useState("");

  // Tạo ref cho FlatList
  const flatListRef = useRef<FlatList>(null);

  // Hàm gửi tin nhắn văn bản
  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      type: "text",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    // Chờ 100ms để UI cập nhật rồi cuộn xuống cuối
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Hàm mở thư viện ảnh/video
  const openMediaLibrary = () => {
    const options = {
      mediaType: "mixed" as MediaType, // ✅ Ép kiểu đúng
      selectionLimit: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Người dùng đã hủy chọn tệp.');
      } else if (response.errorCode) {
        console.log('Lỗi: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];

        const newMessage = {
          id: Date.now().toString(),
          text: asset.uri ?? "", // ✅ Đảm bảo text luôn là string, tránh lỗi undefined
          sender: "me",
          type: asset.type?.startsWith("image") ? "image" : "video",
        };


        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Cuộn xuống cuối sau khi thêm tin nhắn mới
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

  };

  // Render tin nhắn (văn bản, hình ảnh, video)
  const renderMessage = ({ item }: any) => {
    if (item.type === "text") {
      return (
        <View
          style={[
            styles.messageBubble,
            item.sender === "me" ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
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
          <Image source={{ uri: item.text }} style={styles.media} resizeMode="contain" />
        </View>
      );
    }
  };


  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={28} color={color.orange} />
        </TouchableOpacity>
        <Image source={{ uri: "https://picsum.photos/50" }} style={styles.avatar} />
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
      <View style={styles.separator} >
    
        <FlatList
          ref={flatListRef} // Gán ref cho FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />
      </View>
     
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
        <TouchableOpacity onPress={sendMessage} style={[styles.emojiButton, { marginLeft: width * 0.02 }]}>
          <Send size={24} color={color.accentBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
