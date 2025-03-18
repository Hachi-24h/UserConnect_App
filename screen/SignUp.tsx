import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
const { height, width } = Dimensions.get('window');
import { Eye, SearchNormal, EyeSlash, Notification, Profile, Cpu } from "iconsax-react-native";
import color from '../Custom/Color';
const SignUpScreen = ({ navigation }: any) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <LinearGradient colors={["#3D5167", "#999999"]} style={styles.container}>
            <View style={styles.formContainer}>
                <Svg height="50" width="250">
                    <Defs>
                        <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
                            <Stop offset="50%" stopColor="#42A469" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#1976D2" stopOpacity="1" />
                        </SvgLinearGradient>
                    </Defs>
                    <SvgText x="60" y="35" fontSize="40" fontWeight="bold" fill="url(#grad)">
                        PULSE
                    </SvgText>
                </Svg>
                <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" />
                <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        secureTextEntry={!passwordVisible}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ padding: 10 }}>
                        {
                            passwordVisible ? <Eye size={20} color="gray" /> : <EyeSlash size={20} color="gray" />
                        }

                    </TouchableOpacity>
                </View>
                <TextInput style={styles.input} placeholder="Repeat password" secureTextEntry placeholderTextColor="#aaa" />
                <TouchableOpacity style={styles.signUpButton}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.googleButton}>
                    <Image source={require('../Icon/google.png')} style={styles.googleIcon} />
                    <Text style={styles.buttonText2}>Sign up with Google</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.footerText}>You have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 10,}}>
                        <Text style={styles.signInText}> Sign in, here!</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
        marginTop:  10,
    },
    signInText: {
        color: color.white,
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
