// utils/client.ts
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const client = axios.create({
  baseURL: 'http://192.168.1.147:5000', // hoặc 3000 nếu dùng API Gateway
  timeout: 10000,
});

client.interceptors.request.use(
  async (config) => {
    // ⚠️ Không gắn token nếu là API login
    if (config.url?.includes('/auth/login')) {
      return config;
    }

    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${credentials.password}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
