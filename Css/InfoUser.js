import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.darkBackground,
  },
  scroll: {
    paddingBottom: height * 0.1,
  },
  coverContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.25,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  backIcon: {
    position: "absolute",
    top: height * 0.035,
    left: width * 0.04,
  },
  topRightIcons: {
    position: "absolute",
    flexDirection: "row",
    top: height * 0.035,
    right: width * 0.04,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    position: "absolute",
    top: height * 0.18,
    left: width / 2 - width * 0.15,
    borderWidth: 3,
    borderColor: color.white,

  },
  name: {
    marginTop: width * 0.18,
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    color: color.white,
  },
  subText: {
    fontSize: width * 0.04,
    color: color.gray,
    textAlign: "center",
    marginTop: 5,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    gap: width * 0.04, // Khoảng cách giữa các nút
  },
  
  actionButton: {
    backgroundColor: color.gray,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
    shadowColor: color.white,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    marginRight: width * 0.03, // thêm margin nếu cần
  },
  
  actionIcon: {
    width: width * 0.07,
    height: width * 0.07,
    marginRight: width * 0.02,
    resizeMode: "contain",
  },
  
  actionText: {
    color: color.black,
    fontSize: width * 0.035,
  },
  card: {
    backgroundColor: color.lightgray,
    marginTop: height * 0.03,
    marginHorizontal: width * 0.05,
    borderRadius: 12,
    padding: width * 0.05,
    alignItems: "center",
  },
  cardImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: height * 0.02,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
    color: color.white,
    marginBottom: 5,
  },
  cardText: {
    fontSize: width * 0.035,
    textAlign: "center",
    color: color.gray,
    marginBottom: height * 0.015,
  },
  postButton: {
    backgroundColor: color.accentBlue,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    borderRadius: 25,
  },
  postButtonText: {
    color: color.white,
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
});
