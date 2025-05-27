import { store } from '../store/store'; // nếu là export default thì You cần điều chỉnh

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
