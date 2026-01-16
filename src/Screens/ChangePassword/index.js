import { useState } from 'react';
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard, StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import Loader from '../../Components/Loader';
import { Logo } from '../../Assets/svg';
import { Ionicons } from '@expo/vector-icons';
import { CommonStyles } from '../../Themes/CommonStyles';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import getEnvVars from '../../utils/config';

const ChangePassword = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { email } = route.params || {}; // email passed from OTP verify screen

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateForm = () => {
    let newErrors = {};
    const { password, confirmPassword } = form;

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError('');

      const response = await fetch(
        `${baseURL}${endpoints.RESET_PASSWORD}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,          // ✅ coming from route params
            password: form.password, // ✅ use entered password
          }),
        }
      );

      const data = await response.json();

      setLoading(false);

      if (response.ok && data?.status && data?.statusCode === "0") {
        if (data.response?.status) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        } else {
          setApiError(data.response?.message || "Failed to reset password");
        }
      } else {
        setApiError(data?.statusMessage || "Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      setApiError("An error occurred. Please try again.");
    }
  };

  const handleGoBack = () => navigation.goBack();
  const handleSignUp = () => navigation.navigate('Login');

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

          <Text style={styles.welcomeText}>Reset Password</Text>
          <Text style={styles.callingText}>Please type something you’ll remember</Text>

          <CustomTextInput
            placeholder="Enter Password"
            title="New password"
            iconName={isPasswordVisible ? "eye-slash" : "eye"}
            iconSize={15}
            iconColor={Colors.DARKGREY}
            secureTextEntry={!isPasswordVisible}
            onPressIcon={togglePasswordVisibility}
            value={form.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <CustomTextInput
            placeholder="Enter Confirm Password"
            title="Confirm new password"
            secureTextEntry={!isConfirmPasswordVisible}
            iconName={isConfirmPasswordVisible ? "eye-slash" : "eye"}
            iconSize={15}
            iconColor={Colors.DARKGREY}
            onPressIcon={toggleConfirmPasswordVisibility}
            value={form.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

          <CustomButton
            title={loading ? <Loader /> : "Reset password"}
            onPress={handleResetPassword}
            buttonStyle={styles.btn}
            disabled={loading}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: responsiveHeight(10),
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: Colors.white
  },

  headingText: {
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
  },
  futureText: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,
  },
  btn: {
    marginVertical: responsiveHeight(3),
  },
  signInBtn: {
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    fontSize: 13,
  },
  callingText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: Fonts.Medium600,
    marginVertical: responsiveHeight(1)
  },

  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(2),
  },

  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    alignSelf: 'center',
    width: responsiveWidth(25)
  },
  footer: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    alignItems: 'center',
    alignSelf: 'center'


  }

});
export default ChangePassword;
