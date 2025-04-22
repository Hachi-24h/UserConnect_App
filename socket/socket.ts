// utils/socket.ts
import { io } from 'socket.io-client';
import BASE_URL from '../config/IpAddress';
const link_socket = `${BASE_URL}:5005`;
const socket = io(link_socket, {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;
