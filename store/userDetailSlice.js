// store/userDetailSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const userDetailSlice = createSlice({
  name: 'userDetail',
  initialState,
  reducers: {
    setUserDetail: (state, action) => action.payload,
    clearUserDetail: () => null,
  },
});

export const { setUserDetail, clearUserDetail } = userDetailSlice.actions;
export default userDetailSlice.reducer;
