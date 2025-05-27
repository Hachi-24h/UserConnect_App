import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  footerContainer: {
    width: width,
    height: 70,
    backgroundColor: color.black, // nền đen hiện đại
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    borderTopWidth: 0.5,
    borderTopColor: color.gray, // nhẹ nhàng phân cách
  },
  iconWrapper: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: color.gray, // màu xám dịu khi chưa chọn
    marginTop: 5,
  },
  selectedLabel: {
    color: color.accentBlue, // hoặc color.accentPurple nếu You thích tím hơn
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
