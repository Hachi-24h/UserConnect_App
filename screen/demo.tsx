import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import color from '../Custom/Color';
const { height, width } = Dimensions.get('window');
const WelcomeScreen = ({ navigation }: any) => {
  const [status , setStatus] = useState('slideInUp');
  const [count , setCount] = useState("1");
  useEffect(() => {
    setTimeout(() => {
      setStatus('shake');
      setCount("");
    }, 3000);
  }, []);
  return (
    <LinearGradient colors={["#3D5167", "#999999"]} style={styles.container}>
      <Animatable.View
        animation="slideInLeft"
        duration={2500}
        delay={300}
        style={styles.titleContainer}
      >
        <Svg height="100" width="500">
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="50%" stopColor="#42A469" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1976D2" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgText
            x="250"
            y="80"
            fontSize="100"
            fontWeight="bold"
            textAnchor="middle"
            fill="url(#grad)"
          >
            PULSE
          </SvgText>
        </Svg>
      </Animatable.View>
      <Animatable.Image
        animation="slideInDown"
        duration={4000}
        iterationCount={1}
        direction="alternate"
        source={require('../Picture/wellcome.png')}
        style={styles.image}
      />

      <Animatable.Text
        animation="slideInRight"
        duration={1500}
        delay={500}
        style={styles.description}
        
      >
        Welcome to PULSE!
        {'\n'}Your new favorite way to stay connected. Start chatting and make every message count! 🚀
      </Animatable.Text>

      <Animatable.View
        animation={status}
        duration={1500}
        iterationDelay={status !== "slideInUp" ? 2000 : 0}
        iterationCount={status !== "slideInUp" ? "infinite" : 1}
      >
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: 'column',
    alignItems: 'center',
    width: width,
    height: height,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.1,
    width: width * 0.9,
    justifyContent: 'center',
    marginVertical: height * 0.05,
   
  },
  image: {
    width: width * 0.7,
    height: height * 0.5,
    resizeMode: 'contain',
   
  },
  description: {
    fontSize: 16,
    color: color.white,
    textAlign: 'left',
    marginBottom: height * 0.05,
    width: width * 0.9,
  },
  button: {
    backgroundColor:color.BrightRedOrange,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
