import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userDetailReducer from './userDetailSlice';
import unreadReducer from './unreadSlice'; // thêm dòng này ✅
const store = configureStore({
  reducer: {
    user: userReducer,
    userDetail: userDetailReducer,
    unread: unreadReducer, // thêm dòng này ✅
  },
});


export type RootState = ReturnType<typeof store.getState>; // ✅ Thêm dòng này
export default store;