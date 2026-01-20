import { useState } from 'react';
import {
    View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, Modal,
    ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../Components/CustomTextInput';
import Loader from '../../Components/Loader';
import styles from './styles';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../utils/config';
import { LoginImg, Logo } from '../../Assets/svg';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomHeader from '../../Components/CustomHeader';
import images from '../../Themes/Images';



const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState({ email: '', password: '', api: '' });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [emailExistsAndVerified, setEmailExistsAndVerified] = useState(true);
    const [phoneExistsAndVerified, setPhoneExistsAndVerified] = useState(true);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleInputChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value.trim(),
        }));
    };

    const makePhoneCall = (phoneNumber = '+911246687770') => {
        Linking.openURL(`tel:${phoneNumber}`)
            .catch(err => error("Error while making a phone call", err));
    };

    const sendEmail = (emailAddress = 'partnership@InvesTek.in') => {
        const subject = "";
        const body = "";
        Linking.openURL(`mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
            .catch(err => console.error("Error while sending email", err));
    };


    const validateForm = () => {
        let isValid = true;
        let errorMessages = { email: '', password: '' };

        if (!formData.email) {
            errorMessages.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errorMessages.email = 'Invalid email format';
            isValid = false;
        }
        if (!formData.password) {
            errorMessages.password = 'Password is required';
            isValid = false;
        }
        setError(errorMessages);
        return isValid;
    };


    const sendOtp = async ({ otpType, nextScreen }) => {
        try {
            setModalLoading(true);

            const response = await fetch(
                `${baseURL}${endpoints.SEND_SIGNUP_OTP}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        phone: formData.phone,
                        otpType,
                    }),

                }
            );

            const data = await response.json();


            setModalLoading(false);

            if (response.ok && data?.status && data?.statusCode === "0") {
                if (data.response?.status) {

                    setModalVisible(false);

                    navigation.navigate(nextScreen, {
                        email: data?.response?.email,
                        phone: data?.response?.phone,
                        otpSent: true,
                    });
                    return;
                } else {
                    setError(data.response?.message || "Something went wrong");
                }
            } else {
                setError(data?.statusMessage || "Something went wrong");
            }
        } catch (err) {
            setModalLoading(false);
            setError("An error occurred. Please try again.");
        }
    };

    const handleVerifyEmail = () => {
        sendOtp({
            otpType: "signup",
            nextScreen: "SignUpEmailOtpVerify",
        });
    };

    const handleVerifyPhone = () => {
        sendOtp({
            otpType: "phone_signup",
            nextScreen: "SignUpPhoneOtpVerify",
        });
    };

    const RenderModal = () => {
        return (
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalMessage}>
                            {modalMessage}
                        </Text>


                        <CustomButton
                            title={
                                modalLoading ? (
                                    <Loader />
                                ) : !emailExistsAndVerified ? (
                                    "Verify Email"
                                ) : (
                                    "Verify Phone"
                                )
                            }
                            onPress={
                                !emailExistsAndVerified
                                    ? handleVerifyEmail
                                    : handleVerifyPhone
                            }
                            disabled={modalLoading}
                        />

                        <Text
                            style={styles.cancelText}
                            onPress={() => setModalVisible(false)}
                        >
                            Cancel
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    };
    const handleSignIn = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError({ email: "", password: "", api: "" });

            console.log("Attempting Login...");
            console.log("URL:", `${baseURL}${endpoints.LOGIN}`);
            console.log("Body:", JSON.stringify({ email: formData.email, password: formData.password }));

            const response = await fetch(`${baseURL}${endpoints.LOGIN}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            console.log("Response Status:", response.status);
            const textData = await response.text();
            console.log("Raw Response:", textData);

            let data;
            try {
                data = JSON.parse(textData);
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                throw new Error("Invalid JSON response from server");
            }

            setLoading(false);

            if (!data?.response) {
                setError(prev => ({ ...prev, api: "Something went wrong" }));
                return;
            }

            const res = data.response;

            if (res.status === "CLIENT_LOGGED_IN" && res.directLogin === true) {
                await AsyncStorage.setItem("clientsDetails", JSON.stringify(res));
                await AsyncStorage.setItem("userEmail", res.email);
                await AsyncStorage.setItem("authToken", res.token);
                await AsyncStorage.setItem("clientID", String(res.client_id));
                await AsyncStorage.setItem("userID", String(res.id));
                if (res.managerId) await AsyncStorage.setItem("managerID", String(res.managerId));
                await AsyncStorage.setItem("detailsCompleted", JSON.stringify(res.detailsCompleted));

                navigation.reset({
                    index: 0,
                    routes: [{ name: "BTabNavigation" }],
                });
                return;
            }

            if (res.emailExistsAndVerified === false) {
                setModalMessage(res.message);
                setEmailExistsAndVerified(false);
                setPhoneExistsAndVerified(true);

                setFormData(prev => ({
                    ...prev,
                    email: res.email,
                    phone: res.phone
                }));

                setModalVisible(true);
                return;
            }


            if (res.phoneExistsAndVerified === false) {
                setModalMessage(res.message);
                setEmailExistsAndVerified(true);
                setPhoneExistsAndVerified(false);

                setFormData(prev => ({
                    ...prev,
                    email: res.email,
                    phone: res.phone
                }));

                setModalVisible(true);
                return;
            }


            // 📌 CASE C: LOGIN SUCCESS → OTP SENT
            if (res.status === true && res.otpSent === true) {
                navigation.navigate("LoginOtpVerify", {
                    email: res.email,
                    otpSent: true
                });
                return;
            }

            // 📌 CASE D: USER DOES NOT EXIST
            if (res.status === "USER_NOT_EXIST") {
                setError(prev => ({ ...prev, api: res.message || "User not found" }));
                return;
            }

            // 📌 CASE E: INVALID CREDENTIAL
            if (res.status === "INVALID_CREDENTIAL") {
                setError(prev => ({ ...prev, api: res.message || "Incorrect email or password" }));
                return;
            }

            // Fallback
            setError(prev => ({ ...prev, api: res.message || "Something went wrong" }));

        } catch (err) {
            console.error("Login Error Details:", err);
            setLoading(false);
            setError(prev => ({ ...prev, api: "Failed to login. Please try again." }));
        }
    };


    const handleSignUp = () => {
        navigation.navigate('RegisterationForm');
    };
    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={CommonStyles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <CustomHeader />
                      <LoginImg style={styles.logo} width={responsiveWidth(120)}/>
                      <ImageBackground source={images.LoginBG} style={styles.imageBackgroundStyle}>
                    <CustomTextInput
                        placeholder="User ID"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                    />
                    {error.email ? <Text allowFontScaling={false} style={styles.errorText}>{error.email}</Text> : null}
                    <CustomTextInput
                        placeholder="Password"
                        iconName={isPasswordVisible ? 'eye-slash' : 'eye'}
                        iconSize={15}
                        iconColor={Colors.darkGrey}
                        secureTextEntry={!isPasswordVisible}
                        onPressIcon={togglePasswordVisibility}
                        value={formData.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                    />
                    {error.password ? <Text allowFontScaling={false} style={styles.errorText}>{error.password}</Text> : null}
                    {error.api ? (
                        <Text allowFontScaling={false} style={styles.errorText}>
                            {error.api}
                        </Text>
                    ) : null}
                    <Text allowFontScaling={false} style={styles.ForgotPssText} onPress={handleForgotPassword}>
                        Forgot Password?
                    </Text>
                    {RenderModal()}
                    <CustomButton
                        title={loading ? <Loader /> : "Sign In"}
                        onPress={handleSignIn}
                        buttonStyle={styles.btn}
                        disabled={loading}
                    />

                        <Text allowFontScaling={false} style={styles.futureText}>New to Trazyy?</Text>
                        <Text allowFontScaling={false} style={styles.signInBtn} onPress={handleSignUp}>Create Account</Text>
                                              </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};



export default Login;
