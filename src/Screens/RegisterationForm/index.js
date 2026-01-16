import { useState } from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Alert,
    Modal
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import Loader from '../../Components/Loader'
import * as WebBrowser from 'expo-web-browser';
import getEnvVars from '../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logo } from '../../Assets/svg';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native';


const RegisterationForm = () => {
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const { baseURL, endpoints } = getEnvVars();
    const [errors, setErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [emailExistsAndVerified, setEmailExistsAndVerified] = useState(true);
    const [phoneExistsAndVerified, setPhoneExistsAndVerified] = useState(true);



    const handleInputChange = (field, value) => {
        setForm((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateAlphabetic = (text) => /^[A-Za-z]+$/.test(text);
    const validatePhoneNumber = (number) => {
        const cleaned = number.replace(/\D/g, '');
        return /^[0-9]{10}$/.test(cleaned);
    };
    const validatePassword = (password) => {
        const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    };

    const validateForm = () => {
        let newErrors = {};
        const { firstname, lastname, email, phone, password, confirmPassword } = form;

        if (!firstname) {
            newErrors.firstname = "First name is required.";
        } else if (!validateAlphabetic(firstname)) {
            newErrors.firstname = "First name should contain only alphabets.";
        }

        if (!lastname) {
            newErrors.lastname = "Last name is required.";
        } else if (!validateAlphabetic(lastname)) {
            newErrors.lastname = "Last name should contain only alphabets.";
        }

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!phone) {
            newErrors.phone = "Phone number is required.";
        } else if (!validatePhoneNumber(phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (!validatePassword(password)) {
            newErrors.password =
                "Invalid Password.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!isChecked) {
            newErrors.isChecked = "You must agree to the Terms of Service.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                        email: form.email,
                        phone: form.phone,
                        otpType: otpType,
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




    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${baseURL}${endpoints.REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await response.json();


            setLoading(false);

            if (
                data?.status === true &&
                data?.response?.id &&
                data?.response?.otpSent
            ) {

                await AsyncStorage.setItem(
                    'userIdDetails',
                    JSON.stringify({ id: data.response.id })
                );

                navigation.navigate("SignUpEmailOtpVerify", {
                    id: data.response.id,
                    email: data.response.email,
                    otpSent: data.response.otpSent,
                    phone: data.response.phone,
                });

                return;
            }

            const res = data.response;

            if (
                res.emailExistsAndVerified === null ||
                res.phoneExistsAndVerified === null
            ) {
                setError(res.message);
                return;
            }

            if (!res.emailExistsAndVerified && !res.phoneExistsAndVerified) {
                setEmailExistsAndVerified(false);
                setPhoneExistsAndVerified(false);
                setModalMessage(res.message);
                setModalVisible(true);
                return;
            }


            if (res.emailExistsAndVerified && !res.phoneExistsAndVerified) {
                setEmailExistsAndVerified(true);
                setPhoneExistsAndVerified(false);
                setModalMessage(res.message);
                setModalVisible(true);
                return;
            }

            if (res.emailExistsAndVerified && res.phoneExistsAndVerified) {
                setError(res.message);
                return;
            }

            if (res.userAlreadyExist) {
                setError(res.message);
                return;
            }

            setError("Something went wrong. Please try again.");
        } catch (error) {
            setLoading(false);
            setError("Network error. Please try again later.");
        }
    };


    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    const toggleCheckbox = () => setIsChecked(!isChecked);


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Logo style={styles.headingText} />
                    <Text allowFontScaling={false} style={styles.welcomeText}>Create Account</Text>
                    <ScrollView style={styles.bgContainer} showsVerticalScrollIndicator={false}>
                        <CustomTextInput
                            title={'First Name'}
                            placeholder={'Enter First Name'}
                            value={form.firstname}
                            onChangeText={(text) => handleInputChange('firstname', text)}
                        />
                        {errors.firstname && <Text allowFontScaling={false} style={styles.errorText}>{errors.firstname}</Text>}

                        <CustomTextInput
                            placeholder={'Enter Last Name'}
                            title={'Last Name'}
                            value={form.lastname}
                            onChangeText={(text) => handleInputChange('lastname', text)}
                        />
                        {errors.lastname && <Text allowFontScaling={false} style={styles.errorText}>{errors.lastname}</Text>}

                        <CustomTextInput
                            placeholder={'Enter Email'}
                            title={'Email Address'}
                            value={form.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            keyboardType="email-address"
                        />
                        {errors.email && <Text allowFontScaling={false} style={styles.errorText}>{errors.email}</Text>}

                        <CustomTextInput
                            value={form.phone}
                            onChangeText={(text) => {
                                const cleaned = text.replace(/\D/g, '').slice(0, 10);
                                handleInputChange('phone', cleaned);
                            }}
                            placeholder={'Enter Phone Number'}
                            title={'Phone Number'}
                            maxLength={10}
                            keyboardType="phone-pad"
                        />
                        {errors.phone && <Text allowFontScaling={false} style={styles.errorText}>{errors.phone}</Text>}

                        <CustomTextInput
                            placeholder={'Enter Password'}
                            title={'Password'}
                            iconName={isPasswordVisible ? "eye-slash" : "eye"}
                            iconSize={15}
                            iconColor={Colors.DARKGREY}
                            secureTextEntry={!isPasswordVisible}
                            onPressIcon={togglePasswordVisibility}
                            value={form.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                        />
                        <Text allowFontScaling={false} style={styles.valuesText}>Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.</Text>
                        {errors.password && <Text allowFontScaling={false} style={styles.errorText}>{errors.password}</Text>}
                        <CustomTextInput
                            placeholder={'Enter Confirm Password'}
                            title={'Confirm Password'}
                            secureTextEntry={!isConfirmPasswordVisible}
                            iconName={isConfirmPasswordVisible ? "eye-slash" : "eye"}
                            iconSize={15}
                            iconColor={Colors.DARKGREY}
                            onPressIcon={toggleConfirmPasswordVisibility}
                            value={form.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                        />
                        {errors.confirmPassword && <Text allowFontScaling={false} style={styles.errorText}>{errors.confirmPassword}</Text>}

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity onPress={toggleCheckbox} style={styles.checkbox}>
                                {isChecked && <Entypo name="check" size={responsiveFontSize(2)} color={Colors.blue} />}
                            </TouchableOpacity>
                            <View style={styles.registerrow}>
                                <Text allowFontScaling={false} style={styles.checkboxText}>
                                    I agree to InvesTek's{'  '}
                                    <Text allowFontScaling={false} style={styles.termsText} onPress={() => WebBrowser.openBrowserAsync('https://investek.in/rrp-termsof-use/')}>Terms of Service{' '}</Text>
                                    <Text allowFontScaling={false} style={styles.checkboxText}> &{' '}</Text>
                                    <Text allowFontScaling={false} style={styles.termsText} onPress={() => WebBrowser.openBrowserAsync('https://www.investek.in/privacy-policy')}>{'  '}Privacy Policy</Text>
                                </Text>
                            </View>
                        </View>
                        {errors.isChecked && (
                            <Text allowFontScaling={false} style={styles.errorText}>
                                {errors.isChecked}
                            </Text>
                        )}
                        {error ? <Text allowFontScaling={false} style={styles.errorText}>{error}</Text> : null}
                        {RenderModal()}
                        <CustomButton
                            title={loading ? <Loader /> : "Register Now"}
                            buttonStyle={styles.btn}
                            onPress={handleSignUp}
                            disabled={loading}
                        />
                        <View style={styles.row}>
                            <Text allowFontScaling={false} style={styles.resendText}>Already Have An Account ?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text allowFontScaling={false} style={styles.signupText}> Sign In</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: responsiveHeight(8),
        paddingHorizontal: responsiveWidth(5),
        backgroundColor: Colors.white,
        paddingBottom: responsiveHeight(5)

    },
    headingText: {
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 20,
        color: Colors.blue,
        fontFamily: Fonts.Bold800,
        marginTop: responsiveHeight(0.5),
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },
    bgContainer: {
        flex: 1,
    },
    btn: {
        marginTop: responsiveHeight(2),
        paddingVertical: responsiveHeight(1.5),
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: responsiveHeight(2),
        alignItems: 'center',
    },
    inputBox: {
        marginTop: responsiveHeight(2),
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(1.5),
    },
    checkbox: {
        width: responsiveWidth(4.2),
        height: responsiveHeight(2),
        borderWidth: 1.5,
        borderColor: Colors.grey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsiveWidth(3),
        borderRadius: 5
    },
    checkboxText: {
        fontSize: 11,
        color: Colors.black,
        fontFamily: Fonts.Semibold700,
    },
    registerrow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '84%'
    },
    termsText: {
        color: Colors.skyblue,
        textDecorationLine: 'underline',
    },
    resendText: {
        color: Colors.blue,
        fontFamily: Fonts.Semibold700,
        fontSize: 14,
    },
    signupText: {
        color: Colors.skyblue,
        fontFamily: Fonts.Bold800,
        textDecorationLine: 'underline',
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },

    modalMessage: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: responsiveHeight(2),
        color: Colors.black,
        fontFamily: Fonts.Semibold700,
    },
    cancelText: {
        color: Colors.red, fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),
        fontSize: 15,
    },
    valuesText: {
        color: Colors.skyblue,
        fontSize: 12,
        marginTop: responsiveHeight(0.5),
        fontFamily: Fonts.Semibold700,
    },


});

export default RegisterationForm;
