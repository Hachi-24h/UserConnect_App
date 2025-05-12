import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from './config/screens';
import FlashMessage from "react-native-flash-message";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import socket from './socket/socket';
// import { showNotification } from './Custom/notification';
import { increaseUnread } from './store/unreadSlice';

import CustomToast from './Custom/CustomToast';
import { incrementUnreadCount } from './store/unreadSlice';
import { Alert } from 'react-native';
import { showNotification } from './Custom/notification';
const Stack = createStackNavigator();

const defaultOptions = {
  headerShown: false,
  title: 'Your Screen',
};

const AppContent = () => {
  const [initialScreen, setInitialScreen] = useState("SignIn");
  const navigationRef = useNavigationContainerRef();
  const user = useSelector((state: any) => state.user);
  const userLoginId = user?._id;
  const conversations = useSelector((state: any) => state.chat.conversations);
  const dispatch = useDispatch();
  const [toastVisible, setToastVisible] = useState(false); // 👈 trạng thái hiển thị toast
  const [toastMsg, setToastMsg] = useState({}); // 👈 nội dung toast
  // 🎯 Hàm join tất cả room
  // console.log(" danh sách cuộc hội thoại: ", conversations);
  const joinAllRooms = () => {
    if (userLoginId && conversations.length > 0) {
      conversations.forEach((conv: any) => {
        socket.emit("joinRoom", conv._id);
        // console.log(`🔁 [Re]Join room sau khi chuyển trang: ${conv._id}`);
      });
    }
    console.log("🔁 Đã tham gia tất cả các phòng=============================");
  };

  // 🔄 Join room khi chuyển trang
  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", joinAllRooms);
    return () => unsubscribe && unsubscribe();
  }, [navigationRef, conversations, userLoginId]);

  // 🔥 Lắng nghe tin nhắn toàn cục
 useEffect(() => {
  const handleReceiveMessage = (msg: any) => {
    const isSender = msg.senderId === userLoginId;

    // 💥 Chỉ xử lý nếu bạn KHÔNG phải là người gửi
    if (isSender) return;

    // ✅ Toast / thông báo
    setToastMsg({
      name: msg.name,
      content: msg.content,
      senderAvatar: msg.senderAvatar,
      timestamp: msg.timestamp,
    });
    setToastVisible(true);

    // ✅ Cập nhật unread + Redux
    //@ts-ignore
    dispatch(incrementUnreadCount(msg.receiverId, msg.conversationId, user.token));
    dispatch({
      type: 'chat/updateLastMessage',
      payload: {
        conversationId: msg.conversationId,
        content: msg.content,
        senderId: msg.senderId,
        name: msg.name,
        timestamp: msg.timestamp,
      },
    });
  };
  socket.on("receiveMessage", handleReceiveMessage);
    return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, [dispatch, userLoginId, ]);
  
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={joinAllRooms}
      onStateChange={joinAllRooms}
    >
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{ gestureEnabled: true }}
      >
        {Object.entries(screens).map(([screenName, ScreenComponent]) => (
          <Stack.Screen
            key={screenName}
            name={screenName}
            component={ScreenComponent}
            options={{ ...defaultOptions, title: screenName }}
          />
        ))}
      </Stack.Navigator>
      <CustomToast
        visible={toastVisible}
        msg={toastMsg}
        onHide={() => setToastVisible(false)}
      />
    </NavigationContainer>

  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
    <FlashMessage position="top" floating={true} />
  </Provider>
);

export default App;
