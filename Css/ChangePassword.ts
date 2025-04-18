import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white, // màu nền trắng
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.05,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.borderGray,
  },
  headerTitle: {
    color: color.black,
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginLeft: width * 0.03,
  },
  content: {
    padding: width * 0.05,
  },
  label: {
    color: color.black,
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  input: {
    borderWidth: 1,
    borderColor: color.gray,
    borderRadius: width * 0.02,
    padding: width * 0.04,
    color: color.black,
    backgroundColor: color.white,
  },
  button: {
    marginTop: height * 0.04,
    backgroundColor: color.accentBlue,
    borderRadius: width * 0.03,
    paddingVertical: height * 0.015,
    alignItems: "center",
  },
  buttonText: {
    color: color.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0", // nền xám nhạt
    color: color.gray,          // chữ xám
  },
  
});
