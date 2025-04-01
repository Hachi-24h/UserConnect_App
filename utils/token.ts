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
