import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userDetailReducer from './userDetailSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    userDetail: userDetailReducer,
  },
});

export default store;
