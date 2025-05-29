// screens/SignIn.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity, Dimensions,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import {  Eye, EyeSlash } from "iconsax-react-native";
import color from '../../Custom/Color';
import { login } from '../../utils/auth';
import { showNotification } from '../../Custom/notification';

import LoadingModal from '../../Custom/Loading';
import { getUserDetails } from '../../utils/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

import ip from '../../config/IpAddress';


import { fetchConversations } from '../../store/chatSlice';
import { fetchFollowings } from '../../store/followingSlice';

const { height, width } = Dimensions.get('window');
const SignInScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('hachi11');
  const [password, setPassword] = useState('hachi11');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const BASE_URL = ip.BASE_URL; // Địa chỉ IP của server


  const handleLogin = async () => {
    try {
      setLoading(true);

      // login xong sẽ lưu user vào Redux
      const res = await login(username, password);


      dispatch(setUser({
        _id: res.user._id,
        token: res.token,
        phoneNumber: res.user.phoneNumber, // ✅ thêm dòng này
      }));

      // gọi trực tiếp lại hàm getUserDetails và lấy kết quả (đồng bộ)
      console.log("✅ Đăng nhập thành công", res.user._id);
      
      const detail = await getUserDetails(res.user._id);
      // Lấy danh sách các cuộc trò chuyện
      // @ts-ignore
      await dispatch(fetchConversations(res.user._id, res.token));
      // @ts-ignore
      dispatch(fetchFollowings(res.user._id));
      setLoading(false);

      if (detail) {
        navigation.navigate('MessHome');
      } else {
        navigation.navigate('UserDetailForm', { userId: res.user._id });
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Đã có lỗi xảy ra", error);
      setLoading(false);
      console.log("❌ Đăng nhập thất bại", error?.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };


  return (
    <LinearGradient colors={["#131C2F", "#131C2F"]} style={styles.container}>
      <View style={styles.formContainer}>
        <Svg height="50" width="250">
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="50%" stopColor="#42A469" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1976D2" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="url(#grad)">
            PULSE
          </SvgText>
        </Svg>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.txtReset} >Reset password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../../Icon/google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText2}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.footerText}>You have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 10 }}>
            <Text style={styles.signInText}> Sign in, here!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingModal visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: width,
    height: height,
  },
  formContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(27, 28, 37, 0.3)',
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 28, 37, 0.3)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
  },
  signInButton: {
    backgroundColor: color.BrightRedOrange,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: color.white,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: color.white,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: color.black,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#aaa',
    marginTop: 10,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetPasswordButton: {
    width: '100%',
    filter: 'brightness(0.5)',
    padding: 0,
    margin: 0,
    marginBottom: 15,
  },
  txtReset: {
    textAlign: 'right',
    color: color.white,
    fontWeight: 'bold',
  }
});

export default SignInScreen;
