// utils/auth.ts
import client from './client';
import * as Keychain from 'react-native-keychain';

export const login = async (username: string, password: string) => {
  try {
    console.log('Đăng nhập với:', { username, password });

    const response = await client.post('/auth/login', { username, password });

    const { token } = response.data;

    console.log('✅ Token nhận được:', token);

    await Keychain.setGenericPassword(username, token);

    return response.data;
  } catch (error: any) {
    console.log('❌ Lỗi đăng nhập:', JSON.stringify(error.response?.data || error.message));
    throw error;
  }
};
