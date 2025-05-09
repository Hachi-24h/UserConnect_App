import axios from 'axios';
import { getToken } from './token';
import ip from '../config/IpAddress';
const BASE_URL = ip.BASE_URL
const clientUserDetail = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 5000,
});
clientUserDetail.interceptors.request.use(
  async (config) => {
    const token = await getToken(); // 👈 lấy token từ Keychain
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export default clientUserDetail;
