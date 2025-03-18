// LoginStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: width * 0.05,
    padding: height * 0.03,
    elevation: 10, // Đổ bóng (Android)
    shadowColor: "#000", // Đổ bóng (iOS)
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  containerQuestion: {
    width: width * 0.8,

    height: height * 0.07,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  question: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#333",
  },
  answersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  answerButton: {
    width: "47%",
    backgroundColor: color.white,
    padding: height * 0.02,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Đổ bóng (Android)

    shadowRadius: 4,
  },
  containerNextQuestion: {
    height: height*0.05, 
    flexDirection: "row",
     justifyContent: "flex-end"
  },
  answerText: {
    fontSize: width * 0.045,
    textAlign: "center",
  },
  nextQuestion: {
    marginTop: height * 0.02,
  }
});

export default styles;
