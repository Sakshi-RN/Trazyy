import { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OTPInput from '../../Components/OTPInput';
import CustomButton from '../../Components/CustomButton';
import { Logo } from '../../Assets/svg';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Loader from '../../Components/Loader';
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from '../../utils/config';


const LoginOtpVerify = ({ route }) => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [isOtpValid, setIsOtpValid] = useState(true);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [timer, setTimer] = useState(180);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { data, email, phone } = route.params;

    const handleOTPChange = (newOtp) => {
        setOtp(newOtp);
        setIsOtpValid(true);
        setMessage("");
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${secs < 10 ? "0" + secs : secs}`;
    };


    const handleSubmit = async () => {
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            setMessage("The OTP must be 6 digits long.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(
                `${baseURL}${endpoints.VERIFY_LOGIN}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email || data?.response?.email,
                        otp: otpString,
                        otpType: "login",
                    }),
                }
            );

            const json = await res.json();

            setLoading(false);

            if (json?.status === true && json?.response?.status === "CLIENT_LOGGED_IN") {
                const details = json.response;

                const token = details.token;
                const client_id = details.client_id;
                const id = details.id;
                const managerId = details.managerId;
                const detailsCompleted = details.detailsCompleted;
                await AsyncStorage.setItem("clientsDetails", JSON.stringify(details));
                await AsyncStorage.setItem("authToken", token);
                await AsyncStorage.setItem("clientID", String(client_id));
                await AsyncStorage.setItem("userID", String(id));
                await AsyncStorage.setItem("managerID", String(managerId));
                await AsyncStorage.setItem("detailsCompleted", JSON.stringify(detailsCompleted));
                navigation.reset({
                    index: 0,
                    routes: [{ name: "OTPVerifiedSuccess" }],
                });
            } else if (json?.response?.status === false) {
                setMessage(json?.response?.message || "OTP verification failed");
                setIsOtpValid(false);
            } else {
                setMessage("Unexpected response, please try again.");
            }
        } catch (error) {
            setLoading(false);
            setMessage("Something went wrong, please try again.");
        }
    };



    const handleResend = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${baseURL}${endpoints.SEND_LOGIN_OTP}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email || data?.response?.email,
                    }),
                }
            );

            const result = await response.json();
            setLoading(false);

            if (response.ok && result?.status && result?.statusCode === "0") {
                if (result.response?.status) {
                    setMessage("OTP resent successfully");
                    setTimer(180);
                    setIsResendDisabled(true);
                } else {
                    setMessage(result.response?.message || "Something went wrong");
                }
            } else {
                setMessage(result?.statusMessage || "Something went wrong");
            }
        } catch (err) {
            setLoading(false);
            setMessage("An error occurred. Please try again.");
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Logo style={styles.headingText} />
                    <Text allowFontScaling={false} style={styles.welcomeText}>Enter code</Text>
                    <Text allowFontScaling={false} style={styles.title}>We’ve sent an SMS with an activation code to your phone +91 {phone}</Text>
                    <OTPInput length={6} otp={otp} setOtp={handleOTPChange} isOtpValid={isOtpValid} />
                    {message !== "" && (
                        <Text style={[styles.message,
                        message.includes("successfully") ? styles.successText : styles.errorText
                        ]}>
                            {message}
                        </Text>
                    )}
                    {isResendDisabled ? (
                        <Text allowFontScaling={false} style={styles.resendText}>
                            Send code again {timer > 0 ? formatTime(timer) : ""}
                        </Text>
                    ) : (
                        <View>
                            <Text style={styles.touchableResendText} allowFontScaling={false}>
                                I didn’t receive a code.{" "}
                                <Text style={styles.resendText} allowFontScaling={false} onPress={handleResend}>
                                    Resend
                                </Text>
                            </Text>
                        </View>
                    )}
                    <CustomButton
                        title={loading ? <Loader /> : 'Verify'}
                        buttonStyle={styles.btnStyle}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


const styles = StyleSheet.create({
    content: { flex: 1, backgroundColor: Colors.white },
    container: {
        flex: 1,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(8),
    },
    welcomeText: {
        fontSize: 26,
        color: Colors.black,
        fontFamily: Fonts.Bold800,
        marginTop: responsiveHeight(4),
    },
    title: {
        fontFamily: Fonts.Medium600,
        fontSize: 16,
        color: Colors.darkGrey,
        marginTop: responsiveHeight(0.5),
        width: responsiveWidth(85)
    },
    headingText: {
        alignSelf: 'center',
    },
    errorMessage: {
        alignSelf: 'center',
        color: Colors.red,
        fontSize: 18,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(3),
    },
    resendText: {
        color: Colors.blue,
        fontSize: 15,
        marginTop: responsiveHeight(3),
        alignSelf: 'center',
        fontFamily: Fonts.Bold800,
    },
    touchableResendText: {
        color: Colors.black,
        fontFamily: Fonts.Medium600,
        marginTop: responsiveHeight(3),
        alignSelf: 'center',
        fontSize: 14,
    },
    btnStyle: {
        marginTop: responsiveHeight(3),
        alignSelf: 'center'
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(3),
        fontFamily: Fonts.Semibold700,
        alignSelf: 'center'
    },
    successText: {
        color: Colors.blue,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },

});

export default LoginOtpVerify;
