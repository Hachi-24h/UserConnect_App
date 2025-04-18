import { StyleSheet, Dimensions } from 'react-native';
import color from '../../Custom/Color';
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    paddingHorizontal: width * 0.06,
  },
  title: {
    fontSize: 24,
    color: '#00FF99',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.03,
  },
  nextButton: {
    backgroundColor: '#00FF99',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: width * 0.08,
    
    borderRadius: 12,
    alignItems: 'center',
    width: width * 0.85,
  },
  modalTitle: {
    fontSize: 20,
    color: '#00FF99',
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: height * 0.025,
  },
 
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  verifyButton: {
    backgroundColor: '#00FF99',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.07,
    borderRadius: 8,
  },
  CancelButton: {
    backgroundColor: color.red,
    borderRadius: 8,
  },
  verifyText: {
    color: '#000',
    fontWeight: 'bold',
  },

  cancelText: {
    color: color.white,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.07,
  },
  codeFieldRoot: {
    justifyContent: 'center',
  },
  cell: {
    width: width * 0.1,
    height: width * 0.12,
    lineHeight: width * 0.12,
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#00FF99',
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  cellFocused: {
    borderColor: '#fff',
  },
});

export default styles;
