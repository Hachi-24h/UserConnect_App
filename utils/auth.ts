// utils/auth.ts
import client from './client';
import { saveToken } from './token';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { setUser } from '../store/userSlice';
import store from '../store/store';
import { setUserDetail } from '../store/userDetailSlice';
import clientUserDetail from './clientUserDetail'; 



export const getUserDetails = async (id: string) => {
  try {
    const res = await clientUserDetail.get(`/users/${id}`);
    if (res.status === 200) {
      store.dispatch(setUserDetail(res.data));
      return res.data; // ✅ return để dùng sau login
    } else {
      return null;
    }
  } catch (err: any) {
    // console.error("❌ Lỗi lấy user detail:", err?.response?.data || err.message);
    return null;
  }
};


// đăng nhập
export const login = async (username: string, password: string) => {
  const res = await client.post('/auth/login', { username, password });

  const { token, user } = res.data;

  // ✅ Lưu token
  await Keychain.setGenericPassword('token', token);
 
  // ✅ Lưu user vào Redux
  const userData = {
    id: user._id,
    username: user.username,
    phoneNumber: user.phoneNumber,
    password: user.password,
  };
  store.dispatch(setUser(userData));

  await getUserDetails(user._id);

  return res.data;
};

  // đăng kí người dùng qua số điện thoại
export const registerUserWithPhone = async (
  phoneNumber: string,
  username: string,
  password: string
) => {
  const res = await client.post('/auth/register/phone', {
    phoneNumber,
    username,
    password,
  });

  const token = res.data.token;
  await saveToken(token); // Lưu token ngay sau khi đăng ký
  return res.data;
};


// Định nghĩa type cho form input
interface RegisterFormData {
  phoneNumber: string;
  username: string;
  password: string;
  repeatPassword: string;
}


type NotificationType = 'success' | 'error' | 'warning' | 'info';

type ShowNotification = (message: string, type: NotificationType) => void;

// Hàm chính
export const validateRegisterForm = (
  formData: RegisterFormData,
  showNotification: ShowNotification
): boolean => {
  const { phoneNumber, username, password, repeatPassword } = formData;

  const phoneRegex = /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{4,19}$/;
  const passwordRegex = /^[a-zA-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{7,}$/;

  if (!phoneNumber || !username || !password || !repeatPassword) {
    showNotification('Please fill in all fields.', 'warning');
    return false;
  }

  if (!phoneRegex.test(phoneNumber)) {
    showNotification('Invalid phone number.', 'error');
    return false;
  }

  if (!usernameRegex.test(username)) {
    showNotification('Invalid username.', 'error');
    return false;
  }

  if (!passwordRegex.test(password)) {
    showNotification('Invalid password.', 'error');
    return false;
  }

  if (password !== repeatPassword) {
    showNotification('Passwords do not match.', 'error');
    return false;
  }

  return true; // ✅ Passed all checks
};


interface CheckUserPayload {
  phoneNumber: string;
  username: string;
}

export const checkUserExists = async (data: CheckUserPayload): Promise<boolean> => {
  try {
    const res = await client.post('/auth/check-user', data);

    // Nếu status 200 → chưa tồn tại
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      // Đã tồn tại
      return true;
    }

    console.error('Check user exists failed:', error);
    return false;
  }
};


// Hàm reset password qua số điện thoại
export const resetPasswordWithPhone = async (phoneNumber: string, password: string) => {
  const res = await client.post('/auth/reset-password-phone', {
    phoneNumber,
    password,
  });
  return res.data;
};

// kiểm tra số điện thoại đã tồn tại hay chưa
export const checkPhoneExists = async (phoneNumber: string) => {
  const res = await client.post('/auth/check-email-phone', {
    email: '',
    phoneNumber,
  });
  return res.data;
};