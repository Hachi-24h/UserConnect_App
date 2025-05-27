import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector, Provider } from 'react-redux';
import FlashMessage from "react-native-flash-message";

import store from './store/store';
import screens from './config/screens';
import CustomToast from './Custom/CustomToast';
import { setupSocketListeners } from './socket/socketHandlers'; // ✅ import mới
import socket from './socket/socket';
import { View } from 'react-native';

const Stack = createStackNavigator();

const defaultOptions = {
  headerShown: false,
  title: 'Your Screen',
};

const AppContent = () => {
  const [initialScreen] = useState("SignIn");
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);
  const userLoginId = user?._id;
  const token = user?.token;
  const conversations = useSelector((state: any) => state.chat.conversations);
  const currentConversationId = useSelector((state: any) => state.userDetail?.currentConversationId);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({});

  useEffect(() => {
    if (userLoginId) {
      socket.emit("setup", userLoginId); // ✅ GIÚP JOIN ROOM USER ID
      console.log("📡 Gửi setup socket với userId:", userLoginId);
    }
  }, [userLoginId]);

  // 🔁 Join tất cả phòng mỗi khi navigation thay đổi
  const joinAllRooms = () => {
    if (userLoginId && conversations.length > 0) {
      conversations.forEach((conv: any) => {
        socket.emit("joinRoom", conv._id);
      });
      // console.log("🔁 Đã join tất cả room từ Navigation");
    }
  };

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", joinAllRooms);
    return () => unsubscribe?.();
  }, [navigationRef, conversations, userLoginId]);

 
  useEffect(() => {
    if (!userLoginId || !token || conversations.length === 0) return;

    const cleanup = setupSocketListeners({
      userId: userLoginId,
      token,
      conversations,
      currentConversationId,
      dispatch,
      setToastMsg,
      setToastVisible,
    });

    return () => cleanup(); // cleanup on unmount or dependency change
  }, [userLoginId, token, conversations, currentConversationId]);

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
    <View style={{ flex: 1 }}>
      <AppContent />
      <FlashMessage position="top" floating={true} />
    </View>
  </Provider>
);

export default App;
