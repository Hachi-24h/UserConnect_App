export const formatMessageTime = (isoString: string): string => {
 
  const dateUTC = new Date(isoString);
  const localDate = new Date(dateUTC.getTime() ); // Chuyển sang GMT+7

  const now = new Date();
  const diffMs = now.getTime() - localDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const isSameDay = now.toDateString() === localDate.toDateString();

  if (diffMinutes < 1) {
    return "less than a minute ago";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffMinutes < 120) {
    return "one hour ago";
  } else if (diffMinutes < 180) {
    return "two hours ago";
  } else if (diffMinutes < 240) {
    return "three hours ago";
  } else if (isSameDay) {
    return "earlier today";
  } else {
    const timeStr = localDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = localDate.toLocaleDateString("vi-VN");
    return `${timeStr} - ${dateStr}`;
  }
};
