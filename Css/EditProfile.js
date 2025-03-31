import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

// Lấy kích thước màn hình
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    width:width,
    height: height,
    backgroundColor: "#f5f5f5",
   
  },
  container1:{
        width:width,
        height:height,
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height:height * 0.08,
    paddingHorizontal: width * 0.05,  
  },
  backButton: {
    padding: width * 0.02,
    
  },
  headerText: {
    fontSize: width * 0.05, // Tỷ lệ phần trăm từ chiều rộng màn hình
    fontWeight: "bold",
    color: "black",
  },
  saveButton: {
    padding: width * 0.03,
    backgroundColor: color.red,
    borderRadius: width * 0.05, 
  },
  saveText: {
    fontSize: width * 0.04,
    color: color.black,
    fontWeight: "bold",
  },

  box1: {
    width: width*0.9,
    height: height * 0.2,
    // backgroundColor: color.gray,
    borderBottomWidth: 2,
    borderBottomColor: color.black,
  },
    box2: {
        marginTop: height * 0.1,
    width: width*0.9,
    
    }
    ,

  profilePicContainer: {
    alignItems: "center",
    marginVertical: height * 0.05,
    position:"absolute",
    left:width*0.2,
    top:height*0.025,
  },
  profilePic: {
    width: width * 0.5, // Chiều rộng bằng 50% chiều rộng màn hình
    height: width * 0.5, // Chiều cao bằng 40% chiều cao màn hình
    borderRadius: width*0.25 , // Giữ tỷ lệ đường tròn
    borderWidth: width * 0.01, // Sử dụng tỷ lệ phần trăm từ chiều rộng màn hình
    borderColor: color.gray,
  },
  cameraIcon: {
    position: "absolute",
    bottom: height * 0.05, // Dùng tỷ lệ phần trăm cho vị trí từ dưới lên
    right: width * 0.05, // Dùng tỷ lệ phần trăm cho vị trí từ phải sang
 
    padding: width * 0.03, // Dùng tỷ lệ phần trăm từ chiều rộng màn hình
    borderRadius: 50,
  },
  inputGroup: {
    marginBottom: height * 0.04, // Khoảng cách giữa các trường theo chiều cao màn hình
  },
  label: {
    fontSize: width * 0.04,
    color: "black",
    marginBottom: height * 0.02, 
    fontWeight: "bold",
    marginLeft: width * 0.02,
  },
  input: {
    backgroundColor: "white",
    padding: width * 0.03, // Padding tương tự theo tỷ lệ phần trăm chiều rộng
    borderRadius: width * 0.05, // Tạo bo tròn với tỷ lệ phần trăm chiều rộng
    borderWidth: width * 0.005, // Tỷ lệ phần trăm cho borderWidth
    borderColor: color.gray,
  },
  textArea: {
    backgroundColor: "white",
    padding: width * 0.03,
    borderRadius: width * 0.05,
    borderWidth: width * 0.005,
    borderColor: color.gray,
    height: height * 0.15, // Dùng tỷ lệ phần trăm từ chiều cao màn hình
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: height * 0.02, // Khoảng cách giữa các phần tử
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.05, // Khoảng cách từ trên xuống theo chiều cao màn hình
  },
  icon: {
    marginHorizontal: width * 0.04, // Khoảng cách giữa các icon theo chiều rộng màn hình
  },
  backIcon: {
    width: width * 0.06, // Tỷ lệ phần trăm chiều rộng màn hình
    height: width * 0.06, // Tỷ lệ phần trăm chiều rộng màn hình
  },
});

export default styles;
