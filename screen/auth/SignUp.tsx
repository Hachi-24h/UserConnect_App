import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Eye, EyeSlash } from 'iconsax-react-native';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import styles from '../../Css/SignUp';
import color from '../../Custom/Color';
import { showNotification } from '../../Custom/notification';
import { validateRegisterForm, checkUserExists, registerUserWithPhone } from '../../utils/auth';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import LoadingModal from '../../Custom/Loading';
const { width } = Dimensions.get('window');
const CELL_COUNT = 6;
const SignUp = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('0379664715');
  const [username, setUsername] = useState('hachi');
  const [password, setPassword] = useState('nam@1234');
  const [repeatPassword, setRepeatPassword] = useState('nam@1234');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: otp, setValue: setOtp });
  const [isLoading, setIsLoading] = useState(false);
  const formatToE164 = (phone: string) => {
    return phone.startsWith('0') ? '+84' + phone.slice(1) : phone;
  };

  const handleSignUp = async () => {
    const isValid = validateRegisterForm({ phoneNumber, username, password, repeatPassword }, showNotification);
    if (!isValid) return;

    const exists = await checkUserExists({ phoneNumber, username });
    if (exists) {
      showNotification('Phone or username already in use', 'error');
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
      // console.error('❌ Lỗi gửi OTP:', err);
      showNotification('Failed to send OTP !! ', 'error');
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmation || otp.length < 6) return;

    try {
      await confirmation.confirm(otp);
      const localPhone = phoneNumber.startsWith('+84') ? phoneNumber.replace('+84', '0') : phoneNumber;

      const res = await registerUserWithPhone(localPhone, username, password);
      showNotification('🎉 Đăng ký thành công!', 'success');
      setShowModal(false);
      navigation.navigate('SignIn');
    } catch (error: any) {
      // sai mật khẩu hoặc OTP
      showNotification("Please check your OTP or password", 'error');
      
    }
  };

  return (
    <LinearGradient colors={['#3D5167', '#999999']} style={styles.container}>
      <View style={styles.formContainer}>
        <Svg height="50" width="250">
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="50%" stopColor="#42A469" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1976D2" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="url(#grad)">PULSE</SvgText>
        </Svg>

        <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#aaa" value={phoneNumber} onChangeText={setPhoneNumber} />
        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          {passwordVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Repeat password"
          secureTextEntry={!passwordVisible2}
          placeholderTextColor="#aaa"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible2(!passwordVisible2)} style={styles.eyeIcon2}>
          {passwordVisible2 ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../../Icon/google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText2}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.footerText}>You have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 10 }}>
            <Text style={styles.signInText}> Sign in, here!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal nhập OTP */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
       
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>A code has been sent to {formatToE164(phoneNumber)}</Text>

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
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
                </View>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                <Text style={styles.verifyText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.CancelButton}>
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
