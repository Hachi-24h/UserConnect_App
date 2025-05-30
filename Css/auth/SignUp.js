// src/screens/SignUpStyle.ts
import { StyleSheet, Dimensions } from 'react-native';
import color from '../../Custom/Color';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  formContainer: {
    width: width * 0.9,
    padding: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.9)', // Match SignIn background
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)', // Match SignIn border
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(31, 41, 55, 0.8)', // Match SignIn input background
    borderRadius: 12,
    marginBottom: 16,
    color: '#ffffff', // Match SignIn text color
    fontSize: 16,
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
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#4CAF50', // Match SignIn button color
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#1f2937', // Match SignIn Google button background
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)', // Match SignIn Google button border
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff', // Match SignIn button text color
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText2: {
    color: '#ffffff', // Match SignIn Google button text color
    fontWeight: '500',
    fontSize: 16,
  },
  footerText: {
    color: '#9ca3af', // Match SignIn footer text color
    fontSize: 14,
  },
  signInText: {
    color: '#4CAF50', // Match SignIn footer link color
    fontWeight: 'bold',
    fontSize: 14,
  },
  eyeIcon: {
    position: 'absolute',
    right: width * 0.05,
    top: height * 0.03,
  },
  eyeIcon2: {
    position: 'absolute',
    right: width * 0.05,
    top: height * 0.03,
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
