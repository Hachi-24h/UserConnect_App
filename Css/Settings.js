import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.darkBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.cardBackground,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: color.textPrimary,
    marginLeft: width * 0.04,
  },
  content: {
    paddingVertical: height * 0.01,
  },
  item: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: color.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: color.borderGray,
  },
  itemText: {
    fontSize: width * 0.045,
    color: color.textPrimary,
  },
  divider: {
    height: 10,
    backgroundColor: color.darkBackground,
  },
  logoutButton: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: color.darkgray,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: width * 0.02,
    alignSelf: "center",
    gap: width * 0.02,
  },
  logoutText: {
    fontSize: width * 0.045,
    color: color.black,
    fontWeight: "bold",
  },
});

export default styles;
