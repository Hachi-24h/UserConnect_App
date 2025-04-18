import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import screens from './config/screens';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import  store  from './store/store'; // import store Redux


const Stack = createStackNavigator();
const defaultOptions = {
  headerShown: false,
  title: 'Your Screen', 
};

const App = () => {
  const [initialScreen, setInitialScreen] = useState("SignIn"); //
  return (
    <>
      <Provider store={store}>
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
      <FlashMessage position="top" floating={true} />
      </Provider>
    </>
  );
};;


export default App;