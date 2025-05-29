// src/screens/SignUpStyle.ts
import { StyleSheet, Dimensions } from 'react-native';
import color from '../../Custom/Color';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  formContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: 'rgba(34, 27, 37, 0.5)',
    borderRadius: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(27, 28, 37, 0.5)',
    borderRadius: 26,
    marginBottom: 15,
    color: color.white,
    paddingLeft: width * 0.05,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 28, 37, 0.3)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
  },
  signUpButton: {
    backgroundColor: color.BrightRedOrange,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: color.white,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: color.white,
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  buttonText2: {
    color: color.black,
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  footerText: {
    color: '#aaa',
    marginTop: 10,
  },
  signInText: {
    color: color.white,
    fontWeight: 'bold',
  },
  eyeIcon:{
    width: width * 0.05,
    height: width * 0.05,
    top: height * 0.254,
    position: 'absolute',
    right: width * 0.1,
  },
  eyeIcon2:{
    width: width * 0.05,
    height: width * 0.05,
    top: height * 0.33,
    position: 'absolute',
    right: width * 0.1,
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    padding: width * 0.07,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.01,
  },
  modalSubtitle: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  codeFieldRoot: {
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
    justifyContent: 'center',
  },
  cell: {
    width: width * 0.11,
    height: width * 0.11,
    lineHeight: width * 0.11,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#00FF99',
    borderRadius: 10,
    textAlign: 'center',
    marginHorizontal: 4,
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  cellText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  cellFocused: {
    borderColor: '#fff',
  },
  modalButtons: {
    marginTop: height * 0.015,
    width: '100%',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#00FF99',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  verifyText: {
    color: '#000',
    fontWeight: 'bold',
  },
  CancelButton: {
    marginTop: 5,
  },
  cancelText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default styles;
