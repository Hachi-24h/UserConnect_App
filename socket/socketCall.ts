// utils/socketCall.ts
import { io } from "socket.io-client";

// Dùng URL của bạn đã deploy
const SOCKET_CALL_URL = "https://pulse-call.up.railway.app";

const socketCall = io(SOCKET_CALL_URL, {
  autoConnect: false,
  transports: ["websocket"], // Quan trọng với React Native
});

export default socketCall;
