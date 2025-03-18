import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color"; // Import file màu sắc

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  footerContainer: {
    width: width,
    height: 70,
    backgroundColor: color.white, // Sử dụng màu trắng từ file color
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  iconWrapper: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: color.gray, // Sử dụng màu xám cho nhãn mặc định
    marginTop: 5,
  },
  selectedLabel: {
    color: color.lightBlue, // Sử dụng màu xanh dương khi được chọn
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
