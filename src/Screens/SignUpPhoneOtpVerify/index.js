import { useState, useEffect } from 'react';
import {
    Text, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, View, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OTPInput from '../../Components/OTPInput';
import CustomButton from '../../Components/CustomButton';
import { Logo } from '../../Assets/svg';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Loader from '../../Components/Loader';
import getEnvVars from '../../utils/config';

const SignUpPhoneOtpVerify = ({ route }) => {
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
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setMessage("The OTP must be 6 digits long.");
            return;
        }

        try {
            setLoading(true);

            const requestBody = {
                otp: otpString,
                otpType: "phone_signup",
                phone: phone,
                email: email,
            };

            const res = await fetch(
                `${baseURL}${endpoints.VERIFY_OTP}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );

            const json = await res.json();
            setLoading(false);

            if (json?.response?.status) {
                Alert.alert("Success", "Account created successfully.", [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });
                        }
                    }
                ]);
            } else {
                setMessage(json?.response?.message || "OTP verification failed");
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
                `${baseURL}${endpoints.SEND_SIGNUP_OTP}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email || data?.response?.email,
                        phone: phone || data?.response?.phone,
                        otpType: "phone_signup"
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
                    <Text allowFontScaling={false} style={styles.welcomeText}>Phone Verify OTP</Text>
                    <Text allowFontScaling={false} style={styles.title}>Enter code</Text>
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
        fontSize: 20,
        color: Colors.blue,
        fontFamily: Fonts.Bold800,
        marginVertical: responsiveHeight(2),
        alignSelf: 'center',
    },
    title: {
        fontFamily: Fonts.Bold800,
        fontSize: 20,
        color: Colors.black,
        marginTop: responsiveHeight(2),
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
        fontSize: 14,
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

export default SignUpPhoneOtpVerify;
