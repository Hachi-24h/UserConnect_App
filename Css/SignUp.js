// src/screens/SignUpStyle.ts
import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';

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
});

export default styles;
