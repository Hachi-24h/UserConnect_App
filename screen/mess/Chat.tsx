import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RouteProp, useRoute } from "@react-navigation/native";
import styles from "../../Css/mess/chat";
import socket from "../../socket/socket";
import { getMessages } from "../../socket/chatApi";
import { resetUnread } from "../../store/unreadSlice";
import { getMessagesByConversation, getPinnedMessagesByConversation, setMessages, } from "../../store/chatSlice";
import { selectMessagesByConversation } from '../../store/chatSelectors';
import MessageBubble from "./component/Chat/MessageBubble";
import ChatHeader from "./component/Chat/ChatHeader";
import MessageInput from "./component/Chat/MessageInput";
import { setCurrentConversationId } from "../../store/userDetailSlice";


interface UserChat {
  isGroup: any;
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

const ChatScreen = ({ navigation }: any) => {
  const route = useRoute<RouteProp<Record<string, { user: UserChat }>, string>>();
  const { user } = route.params;
  console.log("user chat nhận được: ", user)
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const conversationId = user.conversationId;
  const messages = useSelector(selectMessagesByConversation(conversationId));
  const userDetailState = useSelector((state: any) => state.userDetail.info);
  // console.log("🚀 ~ file: Chat.tsx:20 ~ userDetailState:", userDetailState);
  const flatListRef = useRef<FlatList>(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  const [inputText, setInputText] = useState("");
  const name = `${userDetailState.firstname} ${userDetailState.lastname}`;
  const avatar = userDetailState.avatar || "https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg";
  const [otherUserIds, setOtherUserIds] = useState<string[]>([]);
  const conversation = useSelector((state: any) =>
    state.chat.conversations.find((c: any) => c._id === conversationId)
  );
  const currentUserId = currentUser._id;
  // console.log("🚀 ~ file: Chat.tsx:30 ~ currentUserId:", currentUserId);
  useEffect(() => {
    if (conversation && currentUserId) {
      const ids: string[] = [];

      if (conversation.isGroup && conversation.members) {
        conversation.members.forEach((m: any) => {
          if (m.userId !== currentUserId && !ids.includes(m.userId)) {
            ids.push(m.userId);
          }
        });
      } else if (conversation.otherUser && conversation.otherUser._id !== currentUserId) {
        if (!ids.includes(conversation.otherUser._id)) {
          ids.push(conversation.otherUser._id);
        }
      }

      setOtherUserIds(ids);

    }
  }, [conversation, currentUserId]);
  // console.log("danh sách id nhắn:", otherUserIds); 
  const isGroup = conversation?.isGroup;


  const pinnedMessages = useSelector((state) =>
    getPinnedMessagesByConversation(state, conversationId)
  );



  useEffect(() => {
    if (conversationId) {
      dispatch(resetUnread(conversationId));
      dispatch(setCurrentConversationId(conversationId));
    }

    return () => {
      dispatch(setCurrentConversationId(null));
    };
  }, [conversationId]);
  useEffect(() => {
    if (!conversationId) return;
    socket.emit("joinRoom", conversationId);

    if (!messages || messages.length === 0) {
      fetchMessages();
    }
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
    if (flatListRef.current && messageListWithDates.length > 0) {
      flatListRef.current.scrollToIndex({
        index: messageListWithDates.length - 1,
        animated: true,
      });
    }
  };



  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const buildMessageListWithDates = (messages: Message[]) => {
    const result: any[] = [];
    let lastDate = null;
    for (const msg of messages) {
      const dateStr = formatDate(msg.timestamp);
      if (dateStr !== lastDate) {
        result.push({ type: 'date', date: dateStr });
        lastDate = dateStr;
      }
      result.push({ type: 'message', data: msg });
    }
    return result;
  };

  const messageListWithDates = buildMessageListWithDates(messages as any);

  const messageIndexMap = new Map<string, number>();
  messageListWithDates.forEach((item, index) => {
    if (item.type === 'message' && item.data?._id) {
      messageIndexMap.set(item.data._id, index);
    }
  });
  const scrollToMessageById = (id: string) => {
    setHighlightedMsgId(id); // 👈 đánh dấu tin nhắn được chọn
    const index = messageIndexMap.get(id);
    if (index !== undefined && flatListRef.current) {
      const middleIndex = Math.max(0, index - 5); // lùi để đưa gần giữa
      flatListRef.current.scrollToIndex({
        index: middleIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };
  useEffect(() => {
    return () => {
      setHighlightedMsgId(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <ChatHeader
        user={user}
        navigation={navigation}
        pinnedMessages={pinnedMessages}
        onScrollToMessage={scrollToMessageById}
        setHighlightedMsgId={setHighlightedMsgId} // ✅ Thêm dòng này
        otherUserIds={otherUserIds}
        currentUserDetail={userDetailState}
      />

      <FlatList
        ref={flatListRef}
        data={messageListWithDates}
        keyExtractor={(item, index) => item?.data?._id || `${item.type}-${index}`}
        renderItem={({ item, index }) => {
          if (item.type === 'date') {
            return (
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <View style={{
                  backgroundColor: '#ccc',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#444' }}>── {item.date} ──</Text>
                </View>
              </View>
            );
          }

          const msg: Message = item.data;
          const isMine = msg.senderId?.toString() === currentUser._id?.toString();



          // ✅ Fix đúng logic avatar (bỏ qua item type === 'date')
          let prevMsg = null;
          for (let i = index - 1; i >= 0; i--) {
            if (messageListWithDates[i]?.type === 'message') {
              prevMsg = messageListWithDates[i].data;
              break;
            }
          }

          const showAvatar = isGroup && (!prevMsg || prevMsg.senderId !== msg.senderId);

          return (
            <MessageBubble
              message={msg}
              isMine={isMine}
              isGroup={isGroup}
              showAvatar={showAvatar}
              conversationId={conversationId}
              highlightedMsgId={highlightedMsgId}
            />
          );
        }}
        contentContainerStyle={styles.messagesList}
        getItemLayout={(data, index) => ({
          length: 100, // Ước lượng chiều cao mỗi dòng
          offset: 100 * index,
          index,
        })}
      />

      <MessageInput
        inputText={inputText}
        setInputText={setInputText}
        conversationId={conversationId}
        senderId={currentUser._id}
        name={name}
        avatar={avatar}
      />

    </View>
  );
};

export default ChatScreen;
