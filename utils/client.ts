import axios from 'axios';
import { getToken } from './token';
import BASE_URL from '../config/IpAddress';
const client = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 5000,
});

// Gắn token tự động cho mỗi request
client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
