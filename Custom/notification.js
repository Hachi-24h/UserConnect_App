import { showMessage } from "react-native-flash-message";

export const showNotification = (message, type = "success") => {
  showMessage({
    message: message,
    type: type === "success" ? "success" : type === "warning" ? "info" : "error",
    duration: 2000,
    position: "top",
    animated: true,
    animationDuration: 500,
    icon: type === "success" ? "success" : type === "warning" ? "info" : "danger",
    backgroundColor:
      type === "success"
        ? "#4CAF50"
        : type === "warning"
        ? "#EEC900" // Màu vàng cho warning
        : "#F44336", // Màu đỏ cho lỗi
    color: type === "warning" ? "black" : "white",
    style: {
      borderRadius: 10,
      margin: 10,
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginTop: 30,
    },
    titleStyle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });
};
