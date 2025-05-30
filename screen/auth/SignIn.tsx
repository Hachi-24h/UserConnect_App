import { Eye, EyeSlash, Lock, User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Text as SvgText } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import ip from '../../config/IpAddress';
import LoadingModal from '../../Custom/Loading';
import { showNotification } from '../../Custom/notification';
import { fetchConversations } from '../../store/chatSlice';
import { fetchFollowings } from '../../store/followingSlice';
import { setUser } from '../../store/userSlice';
import { getUserDetails, login } from '../../utils/auth';

const { height, width } = Dimensions.get('window');

const SignInScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);

  const dispatch = useDispatch();
  const BASE_URL = ip.BASE_URL;

  // Form validation - enable button only when fields are filled
  useEffect(() => {
    setIsBtnEnabled(username.trim() !== '' && password.trim() !== '');
  }, [username, password]);

  const handleLogin = async () => {
    if (!isBtnEnabled) {
      return;
    }

    try {
      setLoading(true);
      setErrorText('');
      const res = await login(username, password);

      dispatch(
        setUser({
          _id: res.user._id,
          token: res.token,
          phoneNumber: res.user.phoneNumber,
        }),
      );

      const detail = await getUserDetails(res.user._id);
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
      setErrorText(
        error?.response?.data?.message ||
          'Invalid username or password. Please try again.',
      );
      showNotification(
        error?.response?.data?.message || 'An error occurred.',
        error,
      );
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      <View style={styles.formContainer}>
        <Svg height="50" width="250">
          <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="#4CAF50">
            PULSE
          </SvgText>
        </Svg>

        <Text style={styles.title}>Log in to your account</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please enter your details
        </Text>

        {errorText ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : (
          <View style={{ height: 20 }} />
        )}

        {/* Username input */}
        <View style={styles.inputContainer}>
          <User size={20} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Password input with lock icon and toggle eye */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? (
              <Eye size={20} color="#9ca3af" />
            ) : (
              <EyeSlash size={20} color="#9ca3af" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signInButton,
            isBtnEnabled ? styles.buttonEnabled : styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!isBtnEnabled}>
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log in'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../Icon/google.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText2}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}> Sign up, it's free!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingModal visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  formContainer: {
    width: width * 0.9,
    padding: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '500',
  },
  signInButton: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 16,
  },
  buttonEnabled: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText2: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  signUpText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default SignInScreen;
