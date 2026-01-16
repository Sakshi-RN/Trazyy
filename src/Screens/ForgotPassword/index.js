import { useState } from 'react';
import {
    View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import Loader from '../../Components/Loader';
import styles from './styles';
import getEnvVars from '../../utils/config';
import { Logo } from '../../Assets/svg';
import { Ionicons } from '@expo/vector-icons';
import { CommonStyles } from '../../Themes/CommonStyles';


const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: ''
    });
    const [error, setError] = useState({ email: '', api: '' });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();


    const handleInputChange = (field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: value.trim(),
        }));
    };


    const validateForm = () => {
        let isValid = true;
        let errorMessages = { email: '' };

        if (!formData.email) {
            errorMessages.email = 'Email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errorMessages.email = 'Invalid email format.';
            isValid = false;
        }
        setError(errorMessages);
        return isValid;
    };



    const handleVerifyEmail = async () => {
        if (validateForm()) {
            try {
                setLoading(true);

                const response = await fetch(
                    `${baseURL}${endpoints.PASSWORD_RESET_OTP}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: formData.email,
                        }),
                    }
                );

                const data = await response.json();
                setLoading(false);

                if (response.ok && data?.status && data?.statusCode === "0") {
                    if (data.response?.status) {
                        setError((prev) => ({ ...prev, api: "" }));
                        navigation.navigate("ResetPasswOtpVerify", {
                            email: data.response.email,
                            otpSent: true,
                        });
                    } else {
                        setError((prev) => ({
                            ...prev,
                            api: data.response?.message || "Something went wrong",
                        }));
                    }
                } else {
                    setError((prev) => ({
                        ...prev,
                        api: data?.statusMessage || "Something went wrong",
                    }));
                }
            } catch (err) {
                setLoading(false);
                setError((prev) => ({
                    ...prev,
                    api: "An error occurred. Please try again.",
                }));
            }
        }
    };

    const handleSignUp = () => {
        navigation.navigate('Login');
    };
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={CommonStyles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.rowContainer}>
                        <TouchableOpacity onPress={handleGoBack} style={styles.iconStyle}>
                            <Ionicons name="chevron-back" size={24} color={Colors.blue} />
                        </TouchableOpacity>
                        <Logo style={styles.headingText} />
                    </View>
                    <Text allowFontScaling={false} style={styles.welcomeText}>Forgot Password</Text>
                    <Text allowFontScaling={false} style={styles.callingText}>Don’t worry! It happens. Please enter the email associated with your account.</Text>
                    <CustomTextInput
                        placeholder="Enter your Email Address"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        title={'Email Address'}
                    />
                    {error.email ? <Text allowFontScaling={false} style={styles.errorText}>{error.email}</Text> : null}
                    {error.api ? (
                        <Text allowFontScaling={false} style={styles.errorText}>
                            {error.api}
                        </Text>
                    ) : null}
                    <CustomButton
                        title={loading ? <Loader /> : "Send Code"}
                        onPress={handleVerifyEmail}
                        buttonStyle={styles.btn}
                        disabled={loading}
                    />
                    <View style={styles.footer}>
                        <Text allowFontScaling={false} >
                            <Text allowFontScaling={false} style={styles.futureText}>
                                Remember Password ?
                            </Text>{' '}
                            <Text allowFontScaling={false} style={styles.signInBtn} onPress={handleSignUp}>
                                Log in
                            </Text>
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};



export default ForgotPassword;
