import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color"; // Import mã màu

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flexDirection: "column",
        backgroundColor: color.lightBlue,

    },
    // 1. Style cho phần tìm kiếm
    searchBar: {
        position: "absolute", // Để nó nằm đè lên các phần tử khác
        top: 0, // Đặt nó ở trên cùng
        left:0, 
        right: width * 0.05, // Để nó cách mép phải
        height: height * 0.08, // Chiều cao chiếm 10% màn hình
        backgroundColor: "rgba(0, 0, 0, 0.0)", // Màu đen trong suốt (RGBA với alpha = 0.2)
        zIndex: 10, // Bảo đảm nó hiển thị trên cùng
        flexDirection: "row", // Đặt các phần tử con theo hàng ngang
        alignItems: "flex-end", // Căn giữa theo chiều dọc
        
    },

    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: color.orange,
        borderRadius: height * 0.05,
        paddingHorizontal: width * 0.07,
        color: color.orange,
        fontStyle: "italic", // Làm cho chữ in nghiêng
        marginRight: width * 0.02,
        backgroundColor: color.white,
    },
    backicon: {
        width: width * 0.1,
        height: width * 0.1,
        justifyContent: "center",
        alignItems: "center",
    },
    menuIcon: {
        width: width * 0.1,
        height: width * 0.1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color.white, // Nền của nút là trắng
        borderRadius: width * 0.05, // Nút bo tròn hoàn toàn
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10, // Kéo dài bóng xuống
        },
        shadowOpacity: 0.8, // Bóng đậm
        shadowRadius: 15, // Làm mềm bóng
        elevation: 15, // Tăng độ cao cho Android

    },

    resultList: {
        position: 'absolute', // Danh sách kết quả nằm tuyệt đối
        top: height * 0.08, // Bắt đầu ngay dưới thanh tìm kiếm
        left: 0,
        right: 0,
        backgroundColor: color.beige, // Nền trắng để rõ ràng
        zIndex: 9, // Đặt dưới thanh tìm kiếm nhưng trên các thành phần khác
        maxHeight: '40%', // Giới hạn chiều cao danh sách
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        width: width * 0.95,
        marginHorizontal: width * 0.02,
    },
    resultItemSearch: {
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.01,
        borderBottomWidth: 1,
        borderBottomColor: color.white,
    },
    resultTextSearch: {
        fontSize: height * 0.018,
        color: color.darkgray,
        fontWeight: "bold",
    },
    resultTextMeaning: {
        fontSize: height * 0.016,
        color: color.gray,
        fontStyle: "italic", // Làm cho chữ in nghiêng
    },
    // 2. Style cho phần chi tiết từ vựng
    wrapper: {
        marginBottom: height * 0.02,
        height: height * 0.92, // Giới hạn chiều cao để cuộn
        overflow: "hidden", // Giới hạn nội dung

    },
    null: {
        height: height * 0.1,

    },
    detailContainer: {
        width: width * 0.9,
        flexDirection: "column",
        alignContent: "center",
        marginHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: color.white,
        borderRadius: 15,
        marginTop: height * 0.02,
    },
    rowDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: width * 0.05,
        justifyContent: "flex-start",
    },
    label: {
        fontSize: height * 0.017,

        color: color.darkgray,
        width: width * 0.25,
        height: height * 0.05,
        textAlign: "center",
        textAlignVertical: "center",
        paddingRight: width * 0.07,
    },
    detail: {
        borderWidth: 1,
        borderColor: color.white,
        borderRadius: 8,
        padding: width * 0.03,
        color: color.darkgray,
        width: width * 0.56,
        flexWrap: "wrap", // Cho phép nội dung xuống dòng
        fontSize: height * 0.018,
        marginBottom: height * 0.02,
        backgroundColor: color.lightBlue,
        fontStyle: "italic", // Làm cho chữ in nghiêng
    },
    synAntContainer: {
        flexDirection: "row",
        paddingHorizontal: width * 0.04,
        backgroundColor: color.white,
        marginTop: height * 0.02,
        marginHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        borderRadius: 15,
        marginBottom: height * 0.02,
        width: width * 0.9,

    },
    synAntSection: {
        flex: 1,


    },
    label2: {
        fontSize: height * 0.02,
        color: color.darkgray,
        width: width * 0.3,
        height: height * 0.05,
        textAlign: "center",
        textAlignVertical: "center",
        paddingRight: width * 0.07,
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: height * 0.01,
    },
    // Phần tử trong mỗi cột
    columnItem: {
        flex: 1, // Chia đều chiều rộng cho mỗi cột
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 8, // Khoảng cách giữa các dòng
        marginHorizontal: 5, // Khoảng cách giữa các cột
    },

    // Text hiển thị trong cột
    listItem: {
        fontSize: 16, // Kích thước chữ
        color: color.darkgray, // Màu chữ
        backgroundColor: color.lightBlue, // Nền màu xanh nhạt
        paddingVertical: 10, // Khoảng cách trên/dưới
        paddingHorizontal: 15, // Khoảng cách trái/phải
        borderRadius: 8, // Bo góc phần tử
        textAlign: "center", // Căn giữa chữ trong phần tử
        overflow: "hidden", // Giới hạn nội dung nếu quá dài
    },
    shadowEffect: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.23,
        shadowRadius: 11.78,
        elevation: 15

    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: height * 0.01,
        paddingHorizontal: width * 0.04,
        width: width * 0.9,

    },

    //  css cho modal
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Làm tối nền bên ngoài modal
        paddingHorizontal: width * 0.05,
        width: width,
    },
    modalContent: {
        width: width * 0.8,
        height: height * 0.4,
        backgroundColor: color.white,
        borderRadius: height * 0.02,
        alignItems: "center",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: width * 0.8,
        marginBottom: height * 0.04,

    },
    closeButton: {
        position: "absolute",
        top: height * 0.010,
        left: width * 0.02,
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: "bold",
        color: "#FFCC99",
        textAlign: "center",
        width: width * 0.6,
        marginTop: height * 0.015,
        marginLeft: width * 0.1,
    },

    input: {
        width: width * 0.65,
        height: height * 0.06,
        borderRadius: width * 0.08,
        paddingLeft: width * 0.07,
        backgroundColor: "#f1f1f1",
        fontStyle: "italic",
        marginBottom: height * 0.02,
        fontSize: width * 0.04,
    },
    listItemContainer: {
        width: width * 0.8,
        height: height * 0.07,

        justifyContent: "center",
    },
    resultItemHorizontal: {
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginHorizontal: width * 0.01, 
        borderRadius: width * 0.02, 
        alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

    },
    resultListHorizontal: {
        width: "100%", // Chiều rộng danh sách
        marginTop: height * 0.01,
        maxHeight: height * 0.1, // Giới hạn chiều cao để tránh tràn
        flexDirection: "row", 
        
    },

    resultText: {
        fontSize: width * 0.04,
        fontStyle: "italic",
        fontWeight: "bold",
    },



    resultItem: {
        backgroundColor: "#E8E8E8",
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.01,
        borderRadius: 5,
       
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: height * 0.02,
        width: "100%",
        paddingTop: height * 0.06,
    },

    button: {
        width: "60%",
        height: height * 0.06,
        borderRadius: height * 0.05,
        backgroundColor: color.orange,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: width * 0
    },

    buttonText: {
        color: color.white,
        fontSize: width * 0.045,
        fontWeight: "bold",
        
    },
   
   

});

export default styles;
