import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userDetailReducer from './userDetailSlice';
import unreadReducer from './unreadSlice'; // thêm dòng này ✅
import chatReducer from './chatSlice'; // 👈 Thêm dòng này
const store = configureStore({
  reducer: {
    user: userReducer,
    userDetail: userDetailReducer,
    unread: unreadReducer,
    chat: chatReducer,
  },
});

export default store;
