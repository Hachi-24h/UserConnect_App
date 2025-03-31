import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Eye, EyeSlash } from 'iconsax-react-native';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import styles from '../../Css/SignUp';
import color from '../../Custom/Color';

const SignUp = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('0379664715');
  const [username, setUsername] = useState('nam123');
  const [password, setPassword] = useState('123');
  const [repeatPassword, setRepeatPassword] = useState('123');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignUp = () => {
    if (!phoneNumber || !username || !password || password !== repeatPassword) {
      Alert.alert('⚠️ Vui lòng nhập đầy đủ thông tin hoặc mật khẩu không khớp!');
      return;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+84${phoneNumber.slice(1)}`;
    navigation.navigate('PhoneAuth', {
      phoneNumber: formattedPhone,
      username,
      password,
    });
  };

  return (
    <LinearGradient colors={['#3D5167', '#999999']} style={styles.container}>
      <View style={styles.formContainer}>
        <Svg height="50" width="250">
          <Defs>
            <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
              <Stop offset="50%" stopColor="#42A469" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1976D2" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="url(#grad)">PULSE</SvgText>
        </Svg>

        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor="#aaa"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ padding: 10 }}>
            {passwordVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Repeat password"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../../Icon/google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText2}>Sign up with Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.footerText}>You have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 10 }}>
            <Text style={styles.signInText}> Sign in, here!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUp;
