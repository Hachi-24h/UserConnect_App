import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userDetailReducer from './userDetailSlice';
import unreadReducer from './unreadSlice';
import chatReducer from './chatSlice';
import followingReducer from './followingSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    userDetail: userDetailReducer,
    unread: unreadReducer,
    chat: chatReducer,
    followings: followingReducer,
  },
});

// ✅ Xuất kiểu RootState và AppDispatch để dùng trong toàn app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
