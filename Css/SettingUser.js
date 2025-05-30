import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Darker background for better contrast
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // Slightly lighter than background
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: width * 0.048,
    fontWeight: 'bold',
    marginLeft: width * 0.04,
    letterSpacing: 0.5,
  },
  scroll: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.07,
  },
  item: {
    paddingVertical: height * 0.022,
    marginVertical: height * 0.004,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: width * 0.042,
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  divider: {
    height: height * 0.012,
    backgroundColor: '#1e293b',
    marginVertical: height * 0.025,
    borderRadius: 6,
    width: '100%',
  },
  sectionTitle: {
    color: '#4CAF50', // Green color to match your PULSE branding
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
    letterSpacing: 0.5,
  },
  logoutItem: {
    paddingVertical: height * 0.022,
    marginVertical: height * 0.004,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: width * 0.042,
    color: '#ef4444', // Red color for logout
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default styles;
