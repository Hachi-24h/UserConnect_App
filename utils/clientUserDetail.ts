import axios from 'axios';
import { getToken } from './token';
import BASE_URL from '../config/IpAddress';
const clientUserDetail = axios.create({
  baseURL: `${BASE_URL}:5002`,
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
