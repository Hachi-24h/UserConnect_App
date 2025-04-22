import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from './config/screens';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import store from './store/store';
import socket from './socket/socket';
import { showNotification } from './Custom/notification';

const Stack = createStackNavigator();
const defaultOptions = {
  headerShown: false,
  title: 'Your Screen',
};

const AppContent = () => {
  const [initialScreen, setInitialScreen] = useState("SignIn");

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      showNotification(`📩 Tin nhắn mới từ ${msg.name || 'ai đó'}: ${msg.content}`, "warning");
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <NavigationContainer>
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
