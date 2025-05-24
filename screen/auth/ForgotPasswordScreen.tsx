import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, Modal, Dimensions
} from 'react-native';
import styles from '../../Css/auth/ForgotPasswordStyle';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { checkPhoneExists } from '../../utils/auth';

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { showNotification } from '../../Custom/notification';
import LoadingModal from '../../Custom/Loading';
const { width } = Dimensions.get('window');
const CELL_COUNT = 6;

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: otp, setValue: setOtp });

  const formatToE164 = (phone: string) => {
    return phone.startsWith('0') ? '+84' + phone.slice(1) : phone;
  };

  const formatToLocal = (phone: string) => {
    return phone.replace('+84', '0');
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      showNotification('Please enter your phone number', 'error');
      return;
    }

    const checkRes = await checkPhoneExists(phoneNumber);

    if (checkRes?.message !== 'Account exists in User') {
      showNotification('This phone number does not exist', 'error');
      return;
    }

    if (isSending) return;
    setIsSending(true);
    setConfirmation(null);

    const e164 = formatToE164(phoneNumber);
    setFormattedPhone(e164);

    try {
      setIsLoading(true);
      const result = await signInWithPhoneNumber(getAuth(), e164);
      setConfirmation(result);
      setOtp('');
      setIsLoading(false);
      showNotification('OTP sent successfully', 'success');

        setShowModal(true);
     
    } catch (error) {
      showNotification('Failed to send OTP', 'error');
      console.error('Error sending OTP:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmation || otp.length < 6) return;

    try {
      setIsLoading(true);
      await confirmation.confirm(otp);
      setIsLoading(false);
      const localPhone = formatToLocal(formattedPhone);

      setShowModal(false);
      navigation.navigate('ResetPassword', { phoneNumber: localPhone });
    } catch (error) {
      console.log('Xác minh OTP thất bại:', error);
      Alert.alert('Sai mã OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>Enter your phone number to receive a verification code</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity
        style={[styles.nextButton, isSending && { opacity: 0.5 }]}
        onPress={handleSendOTP}
        disabled={isSending}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Modal nhập OTP đẹp */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              We’ve sent a verification code to {formattedPhone}
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
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            <View style={styles.modalButtons}>
            <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setConfirmation(null);
                }}
                style={styles.CancelButton}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                <Text style={styles.verifyText}>Verify OTP</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default ForgotPasswordScreen;
