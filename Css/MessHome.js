import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.borderGray,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    gap: width * 0.03,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.045,
    color: color.white,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    backgroundColor: color.borderGray,
    borderBottomWidth:1,
    borderBottomColor: color.gray,
    paddingVertical:width*0.01,
    
  },
  list: {
    paddingHorizontal: width * 0.03,
    paddingTop: height * 0.01,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderGray,
  },
  avatar: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    marginRight: width * 0.03,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.005,
  },
  username: {
    color: color.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
    flex: 1,
    marginRight: width * 0.02,
  },
  time: {
    color: color.gray,
    fontSize: width * 0.035,
  },
  lastMessage: {
    color: color.gray,
    fontSize: width * 0.04,
  },
});
