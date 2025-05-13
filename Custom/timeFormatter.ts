// 📄 utils/timeDisplay.ts
import { format, formatDistanceToNow } from 'date-fns';

export const formatMessageTime = (timestamp: string): string => {
  const ONE_DAY = 86400000;
  const msgTime = new Date(timestamp);
  // console.log("thời gian gốc: ", msgTime);
  const now = Date.now();
    // console.log("thời gian hiện tại: ", now);
  return msgTime.getTime() > now - ONE_DAY
    ? formatDistanceToNow(msgTime, { addSuffix: true }) 
    : format(msgTime, 'MMM dd, yyyy HH:mm');           
};
