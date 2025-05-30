import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { Call, Eye, EyeSlash, Lock, User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Text as SvgText } from 'react-native-svg';
import styles from '../../Css/auth/SignUp';
import LoadingModal from '../../Custom/Loading';
import { showNotification } from '../../Custom/notification';
import {
  checkUserExists,
  registerUserWithPhone,
  validateRegisterForm,
} from '../../utils/auth';

const { width } = Dimensions.get('window');
const CELL_COUNT = 6;

const SignUp = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Enable button when fields are filled
  useEffect(() => {
    setIsBtnEnabled(
      phoneNumber.trim() !== '' &&
        username.trim() !== '' &&
        password.trim() !== '' &&
        repeatPassword.trim() !== '',
    );
  }, [phoneNumber, username, password, repeatPassword]);

  const formatToE164 = (phone: string) => {
    return phone.startsWith('0') ? '+84' + phone.slice(1) : phone;
  };

  const handleSignUp = async () => {
    setErrorText('');

    const isValid = validateRegisterForm(
      { phoneNumber, username, password, repeatPassword },
      showNotification,
    );
    if (!isValid) {
      return;
    }

    const exists = await checkUserExists({ phoneNumber, username });
    if (exists) {
      setErrorText('Phone or username already in use');
      return;
    }

    const formattedPhone = formatToE164(phoneNumber);
    try {
      setIsLoading(true);
      const result = await signInWithPhoneNumber(getAuth(), formattedPhone);
      setConfirmation(result);
      setOtp('');
      showNotification('OTP sent successfully', 'success');
      setIsLoading(false);
      setTimeout(() => setShowModal(true), 600);
    } catch (err) {
      setErrorText('Failed to send OTP');
      showNotification('Failed to send OTP', 'error');
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmation || otp.length < 6) {
      return;
    }

    try {
      await confirmation.confirm(otp);
      const localPhone = phoneNumber.startsWith('+84')
        ? phoneNumber.replace('+84', '0')
        : phoneNumber;

      const res = await registerUserWithPhone(localPhone, username, password);
      showNotification('🎉 Registration successful!', 'success');
      setShowModal(false);
      navigation.navigate('SignIn');
    } catch (error: any) {
      showNotification('Please check your OTP or password', 'error');
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      <View style={styles.formContainer}>
        <Svg height="50" width="250">
          <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="#3B82F6">
            PULSE
          </SvgText>
        </Svg>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join our community! Please enter your details
        </Text>

        {errorText ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : (
          <View style={{ height: 20 }} />
        )}

        {/* Phone input */}
        <View style={styles.inputContainer}>
          <Call size={20} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#9ca3af"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

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

        {/* Password input */}
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

        {/* Repeat Password input */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Repeat Password"
            secureTextEntry={!passwordVisible2}
            placeholderTextColor="#9ca3af"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible2(!passwordVisible2)}>
            {passwordVisible2 ? (
              <Eye size={20} color="#9ca3af" />
            ) : (
              <EyeSlash size={20} color="#9ca3af" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.signUpButton,
            !isBtnEnabled && { backgroundColor: '#4b5563' },
          ]}
          onPress={handleSignUp}
          disabled={!isBtnEnabled}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../Icon/google.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText2}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText} > Sign in here!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* OTP Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              A code has been sent to {formatToE164(phoneNumber)}
            </Text>

            <CodeField
              ref={ref}
              {...props}
              value={otp}
              onChangeText={setOtp}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  key={index}
                  style={[styles.cell, isFocused && styles.cellFocused]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={handleVerifyOTP}>
                <Text style={styles.verifyText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.CancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingModal visible={isLoading} />
    </LinearGradient>
  );
};

export default SignUp;
