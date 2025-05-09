import { showMessage } from "react-native-flash-message";

export const showNotificationCustom = (msg) => {
  showMessage({
    message: msg.name || "Tin nhắn mới",
    description: msg.content || "",
    type: "info",
    backgroundColor: "#fff",
    color: "#000",
    titleStyle: {
      fontWeight: "bold",
      color: "#111",
    },
    descriptionStyle: {
      color: "#444",
    },
    icon: { uri: msg.senderAvatar || "https://placehold.co/100x100" },
    duration: 4000,
    style: {
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 4,
    },
  });
};
