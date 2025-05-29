import { Dimensions, StyleSheet } from 'react-native';
import color from '../Custom/Color';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.darkBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.gray,
    paddingVertical: height * 0.017,
    paddingHorizontal: width * 0.05,
    zIndex: 1,
  },
  headerTitle: {
    color: color.white,
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginLeft: width * 0.04,
  },
  coverImage: {
    width: width,
    height: height * 0.25,
    resizeMode: 'cover',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: color.white,
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: color.white,
    marginTop: 10,
    textAlign: 'center',
  },
  infoSection: {
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Faded border
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  label: {
    fontSize: width * 0.04,
    color: color.white,
    marginBottom: height * 0.008,
  },
  value: {
    fontSize: width * 0.04,
    color: color.white,
    paddingVertical: height * 0.012,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)', // More subtle border
  },
  note: {
    fontSize: width * 0.035,
    color: 'rgba(255, 255, 255, 0.7)', // Slightly transparent for subtlety
    marginTop: -height * 0.01,
    marginBottom: height * 0.015,
  },
  divider: {
    height: 1, // Thinner divider
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Faded divider
    marginVertical: height * 0.02,
  },
  button: {
    backgroundColor: color.primary,
    paddingVertical: height * 0.018,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: color.white,
  },
  sectionTitle: {
    color: color.white,
    fontWeight: 'bold',
    fontSize: width * 0.038,
    marginBottom: height * 0.01,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
});

export default styles;
