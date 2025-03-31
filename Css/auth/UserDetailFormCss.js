import { StyleSheet, Dimensions } from "react-native";
import color from "../../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.darkBackground,
  },
  header: {
    backgroundColor: color.cardBackground,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: width * 0.05,
    borderBottomRightRadius: width * 0.05,
    marginBottom: height * 0.025,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: color.white,
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "500",
    marginBottom: height * 0.01,
    color: color.textPrimary,
  },
  input: {
    backgroundColor: color.cardBackground,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: color.borderGray,
    fontSize: width * 0.04,
    color: color.textPrimary,
  },
  addressInput: {
    height: height * 0.12,
    textAlignVertical: "top",
  },
  datePickerButton: {
    backgroundColor: color.cardBackground,
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: color.borderGray,
  },
  dateText: {
    fontSize: width * 0.04,
    color: color.textPrimary,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.02,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: width * 0.05,
  },
  checkbox: {
    height: width * 0.06,
    width: width * 0.06,
    borderRadius: width * 0.03,
    borderWidth: 2,
    borderColor: color.accentBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: width * 0.02,
  },
  checkboxSelected: {
    borderColor: color.accentBlue,
  },
  checkboxInner: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: width * 0.015,
    backgroundColor: color.accentBlue,
  },
  genderText: {
    fontSize: width * 0.04,
    color: color.textPrimary,
  },
  submitButton: {
    backgroundColor: color.accentBlue,
    borderRadius: width * 0.02,
    paddingVertical: height * 0.02,
    marginTop: height * 0.03,
    alignItems: "center",
  },
  submitButtonText: {
    color: color.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default styles;
