import { StyleSheet, Dimensions } from "react-native";
import color from "../../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.black,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: color.borderGray,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.03,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: color.white,
    overflow: "hidden",
  },
  statusText: {
    fontSize: width * 0.03,
    color: color.gray,
  },
  headerIcons: {
    flexDirection: "row",
    gap: width * 0.05,
  },
  separator: {
    flex: 1,
    width: width,

    marginVertical: height * 0.01,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,

    paddingBottom: height * 0.1, // Đảm bảo có khoảng trống cho input


  },
  messageBubble: {
    maxWidth: "75%",
    padding: width * 0.04,
    borderRadius: width * 0.05,
    marginBottom: height * 0.015,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: color.accentBlue,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: color.darkgray,
  },
  messageText: {
    fontSize: width * 0.045,
    color: color.white,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.005,
    backgroundColor: color.darkgray,
    borderTopWidth: 1,
    borderTopColor: color.gray,



  },
  input: {

    fontSize: width * 0.045,
    color: color.white,
    marginHorizontal: width * 0.02,

    borderWidth: 1,
    borderColor: color.gray,
    borderRadius: width * 0.05,
    paddingLeft: width * 0.05,
    width: "70%",

  },
  emojiButton: {
    width: width * 0.05,
    height: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.05,
    backgroundColor: color.darkgray,
    marginHorizontal: width * 0.02,

  },

  // ✅ Fix lỗi viền xanh quanh ảnh
  mediaContainer: {
    alignSelf: "flex-start",
    borderWidth: 0, // Loại bỏ viền
    backgroundColor: "transparent",
    padding: 0,
    marginBottom: height * 0.015,
  },
  myMedia: {
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    padding: 0,
  },
  otherMedia: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    padding: 0,
  },
  media: {
    width: width * 0.6,
    height: height * 0.3,
    borderRadius: width * 0.02,
    borderWidth: 0, // Đảm bảo không có viền
    overflow: "hidden",
  },
  headerIcons: {
    flexDirection: "row",
    gap: width * 0.05, // giữ khoảng cách
  },
});

export default styles;
