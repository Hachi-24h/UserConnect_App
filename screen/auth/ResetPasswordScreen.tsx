import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Dimensions
} from 'react-native';
import styles from '../../Css/auth/ResetPasswordStyle';
import { showNotification } from '../../Custom/notification';
import { resetPasswordWithPhone } from '../../utils/auth';
import { Eye, EyeSlash } from 'iconsax-react-native';

const { width } = Dimensions.get('window');

const ResetPasswordScreen = ({ navigation, route }: any) => {
  const { phoneNumber } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      await resetPasswordWithPhone(phoneNumber, password);
      showNotification('Password reset successfully', 'success');
      navigation.navigate('SignIn');
    } catch (error: any) {
      console.error('❌ Reset password error:', error?.response?.data || error.message);
      showNotification(
        error?.response?.data?.message || 'Failed to reset password',
        'error'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PULSE</Text>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>
        Enter your email address or phone number, and then create a new password
      </Text>

      <TextInput
        style={styles.input}
        value={phoneNumber}
        editable={false}
        placeholderTextColor="#aaa"
      />

      {/* New Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="New Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          {passwordVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!confirmVisible}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
          {confirmVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.backText}>
          Remember your password? <Text style={styles.backLink}>Back to login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;
