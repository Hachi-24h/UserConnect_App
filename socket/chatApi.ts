// utils/chatApi.ts
import axios from 'axios';
import ip from '../config/IpAddress';
const BASE_URL = ip.BASE_URL; // Địa chỉ API của You
const link_api = `${BASE_URL}/chat`;
// const BASE_URL = 'http://<IP_GATEWAY>:3000/chat'; // ví dụ: 192.168.1.100

export const createOrGetConversation = async (
    user1Id: string,
    user2Id: string,
    token: string
) => {
    const res = await axios.post(
        `${BASE_URL}/chat/conversations/private`,
        {
            user1: user1Id,
            user2: user2Id,
        }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    );
    return res.data;
};

// Lấy tất cả tin nhắn trong cuộc trò chuyện
export const getMessages = async (conversationId: string, token: string) => {
    
    const res = await axios.get(`${link_api}/messages/${conversationId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};