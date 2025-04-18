// utils/token.ts
import * as Keychain from 'react-native-keychain';

/**
 * Lấy token JWT từ Keychain
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    console.error('❌ Lỗi khi lấy token:', error);
    return null;
  }
};

export const saveToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword('auth', token);
  } catch (error) {
    console.log('❌ Lưu token thất bại:', error);
  }
};

export const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.log('❌ Xoá token thất bại:', error);
  }
};