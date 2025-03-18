// LoginStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        width: width, // Đảm bảo chiếm hết chiều ngang
        height: height, // Đảm bảo chiếm hết chiều dọc
        resizeMode: 'cover', // Hoặc 'contain' để giữ nguyên tỷ lệ
        opacity: 0.9, // Làm mờ ảnh
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Bao phủ toàn bộ màn hình
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lớp phủ màu đen, mờ 50%
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        height: height,
        width: width,
    },
    logoContainer: {
        flexDirection: 'column', // Hiển thị các phần tử theo hàng ngang
        justifyContent: 'center', // Căn giữa theo chiều ngang
        alignItems: 'center', // Căn giữa theo chiều dọc
        height: height * 0.3, // Chiều cao của khung chứa
        width: width, // Chiều rộng chiếm toàn màn hình
        marginTop: height * 0.02, // Khoảng cách phía trên
    },
    logo: {
        width: width * 0.25, // Kích thước logo vừa phải
        height: width * 0.25, // Kích thước logo vừa phải
        marginRight: width * 0.05, // Khoảng cách giữa logo và tiêu đề
    },
    title: {
        fontSize: width * 0.2, // Kích thước chữ hợp lý
        fontWeight: 'bold', // Chữ đậm
        color: color.mediumGreen || '#4CAF50', // Màu xanh lá cây hoặc màu mặc định
        letterSpacing: 2, // Khoảng cách giữa các ký tự
        textShadowColor: 'rgba(0, 0, 0, 0.4)', // Màu bóng chữ
        textShadowOffset: { width: 1, height: 1 }, // Dịch chuyển bóng chữ nhẹ
        textShadowRadius: 2, // Làm mềm bóng chữ
    },
    slogan: {
        fontSize: width * 0.045, // Kích thước chữ slogan nhỏ hơn tiêu đề
        fontStyle: 'italic', // Chữ in nghiêng
        color: '#666', // Màu xám nhẹ
        textAlign: 'center', // Căn giữa slogan
        paddingHorizontal: width * 0.1, // Thêm khoảng cách ngang để căn giữa
    },

    wordContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Căn giữa nội dung
        height: height * 0.4, // Chiều cao khung
        width: width * 0.9, // Chiều rộng khung
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Màu nền trắng mờ
        borderRadius: 20, // Bo góc mềm mại hơn
        shadowColor: '#000', // Màu bóng
      
      
    },
    meaningText: {
        fontSize: width * 0.05,
        marginBottom: height * 0.02,
    },
    hintText: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.03,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: width * 0.03,
        width: width * 0.8,
        marginBottom: height * 0.01,
        borderRadius: width * 0.02,
        fontSize: width * 0.045,
        textAlign: 'center', // Căn giữa nội dung, bao gồm cả placeholder và con trỏ
        borderWidth: 1,
        borderColor: "#000",
    },

    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.01,
    },
    loadingText: {
        fontSize: width * 0.045,
    },
    buttonContinue: {
        backgroundColor: color.darkgray, // Màu nền nút (xanh lá cây nhạt)
        paddingVertical: height * 0.01, // Khoảng cách dọc bên trong nút
        paddingHorizontal: width * 0.1, // Khoảng cách ngang bên trong nút
        marginTop: height * 0.01, // Khoảng cách phía trên nút
        borderRadius: width * 0.02, // Bo tròn góc nút
        alignItems: 'center', // Căn giữa nội dung theo chiều ngang
        justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
        shadowColor: '#000', // Màu bóng
        shadowOffset: { width: 0, height: 2 }, // Độ lệch bóng
        shadowOpacity: 0.3, // Độ mờ bóng
        shadowRadius: 5, // Bán kính bóng
        elevation: 5, // Bóng dành cho Android
    },
    textContinue: {
        color:color.yellow, // Màu chữ trắng
        fontSize: width * 0.05, // Kích thước chữ
        fontWeight: 'bold', // Đậm chữ
    },
});

export default styles;
