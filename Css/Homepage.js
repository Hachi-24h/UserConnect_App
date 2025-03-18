// LoginStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import color from '../Custom/Color';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        width: width,
        height: height,
        backgroundColor: color.lightBlue,
        alignItems: 'center',
    },
    search: {
        width: width * 0.9,
        height: height * 0.05,
        padding: width * 0.02,
        backgroundColor: color.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width * 0.05,
        flexDirection: 'row',
        marginTop: height * 0.02,
        paddingLeft:width * 0.02,
    },
    iconsearch: {
        width: width * 0.05,
        height: width * 0.05,
        marginLeft: width * 0.04,
    },
    input: {
        width: width * 0.8,
        height: height * 0.05,
        backgroundColor: color.white,
        borderRadius: width * 0.05,
        paddingLeft: width * 0.04,
    },
    body: {
        width: width * 0.9,
        height: height * 0.8,
        backgroundColor: color.white,
      
        borderRadius: width * 0.05,
    },
  
});
export default styles;