import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from './config/screens';
// Import màn hình demo

const Stack = createStackNavigator();
const defaultOptions = {
  headerShown: false,
  title: 'Your Screen', // Có thể thêm một title mặc định
};

const App = () => {
  const [initialScreen, setInitialScreen] = useState("wellcome");
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen} // Sử dụng màn hình đã được xác định
        screenOptions={{
          gestureEnabled: true, // Cho phép cử chỉ quay lại cho tất cả màn hình
        }}
      >
        {Object.entries(screens).map(([screenName, ScreenComponent]) => (
          <Stack.Screen
            key={screenName}
            name={screenName}
            component={ScreenComponent}
            options={{
              ...defaultOptions,
              title: screenName, // Tự động lấy tên key làm title
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};;


export default App;
