
// utils/auth.ts
import client from './client';
import { saveToken } from './token';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { setUser } from '../store/userSlice';
import store from '../store/store';
import { setUserDetail } from '../store/userDetailSlice';
import clientUserDetail from './clientUserDetail'; 

export const createUserDetail = async (userDetailData: any) => {
    try {
     
      const res = await clientUserDetail.post('/users/', userDetailData); // Token is automatically attached
  
      if (res.status === 201) {
        console.log('✅ User detail created successfully:', res.data);
        return res.data;
      } else {
        console.warn('⚠️ Unexpected response status:', res.status);
        return null;
      }
    } catch (error: any) {
      console.error('❌ Error creating user detail:', error?.response?.data || error.message);
      throw error;
    }
  };

  export const checkEmailExists = async (email: string) => {
    try {
      const res = await clientUserDetail.post('/users/check-email-phone', {
        email: email.trim(),
      });
  
      // Trả về true nếu email đã tồn tại
      return res.data.exists;
    } catch (err: any) {
      console.error('❌ Error checking email existence:', err?.response?.data || err.message);
      throw err;
    }
  };
  
  export const uploadImage = async (file: any) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.fileName || "image.jpg",
    type: file.type || "image/jpeg",
  });

  const res = await axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { url: "http://..." }
};

export const updateUserInfo = async (userId: string, data: any) => {
  const res = await clientUserDetail.put(`/users/${userId}`, data); // có chữ `s`
  return res.data;
};

