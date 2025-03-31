import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  searchBar: {
    backgroundColor: color.cardBackground,
    padding: width * 0.03,
  },
  searchInput: {
    backgroundColor: color.darkgray,
    borderRadius: width * 0.03,
    padding: width * 0.03,
    color: color.white,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: height * 0.015,
    backgroundColor: color.cardBackground,
  },
  tab: {
    color: color.textSecondary,
    fontSize: width * 0.04,
  },
  tabActive: {
    color: color.accentBlue,
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  specialItems: {
    backgroundColor: color.cardBackground,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  specialItem: {
    color: color.white,
    fontSize: width * 0.045,
    marginVertical: height * 0.01,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    justifyContent: "space-between",
    backgroundColor: color.cardBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderGray,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    color: color.white,
    fontSize: width * 0.045,
    marginLeft: width * 0.03,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;
