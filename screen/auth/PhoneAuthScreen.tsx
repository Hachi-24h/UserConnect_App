import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
const { width } = Dimensions.get('window');

const PhoneAuthScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { phoneNumber, username, password } = route.params;

  const [confirmation, setConfirmation] = useState<any>(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const sendOTP = async () => {
      try {
        const auth = getAuth();
        const result = await signInWithPhoneNumber(auth, phoneNumber);
        setConfirmation(result);
        Alert.alert('✅ Mã OTP đã được gửi!');
      } catch (error) {
        console.error('❌ Lỗi gửi OTP:', error);
        Alert.alert('Lỗi gửi OTP', String(error));
      }
    };

    sendOTP();
  }, []);

  const handleConfirm = async () => {
    if (!confirmation) {
      Alert.alert('⚠️ Không có dữ liệu xác nhận!');
      return;
    }

    try {
      await confirmation.confirm(code);

      const res = await fetch('http://192.168.1.147:5000/auth/register/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, username, password }),
      });

      if (res.ok) {
        Alert.alert('🎉 Đăng ký thành công!');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('⚠️ Đăng ký thất bại!');
      }
    } catch (error) {
      console.error('❌ Lỗi xác minh:', error);
      Alert.alert('Sai mã OTP hoặc lỗi xác minh');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP gửi tới:</Text>
      <Text style={styles.phone}>{phoneNumber}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 18 },
  phone: { color: 'cyan', marginBottom: 15 },
  input: {
    width: width * 0.8,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00C853',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default PhoneAuthScreen;
