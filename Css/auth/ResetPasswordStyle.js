import { StyleSheet, Dimensions } from 'react-native';
import color from '../../Custom/Color';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF99',
    marginBottom: height * 0.015,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.015,
  },
  resetButton: {
    width: '100%',
    backgroundColor: color.BrightRedOrange,
    paddingVertical: height * 0.018,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: height * 0.02,

  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backText: {
    color: '#aaa',
  },
  backLink: {
    color: '#00FF99',
    fontWeight: 'bold',
  },
   passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: height * 0.015,
  },

});
