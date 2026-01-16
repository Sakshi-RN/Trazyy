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
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../utils/config';

const RedeemAmountOtpVerify = ({ route }) => {
  const { purchase_id } = route.params || {};
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(180);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${baseURL}${endpoints.PURCHASE_REDEMPTION_CONSENT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: Number(ClientId),
            otp: otpString,
            redemption_id: purchase_id,
          }),
        }
      );

      const json = await response.json();
      setLoading(false);

      if (json?.status === true && json?.response?.status === true) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        setMessage(json?.response?.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("❌ API Error =>", error);
      setLoading(false);
      setMessage("Something went wrong, please try again.");
    }
  };

  const handleResend = async () => {
    try {
      const ClientId = await AsyncStorage.getItem("clientID");

      if (!ClientId) {
        console.warn("No client ID found in AsyncStorage");
        return;
      }

      const response = await fetch(
        `${baseURL}${endpoints.RESEND_CONSENT_OTP}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_id: ClientId }),
        }
      );

      const result = await response.json();

      if (result?.status && result?.statusCode === "0" && result?.statusMessage === "Success") {
        const res = result.response;

        if (res?.status && !res?.error) {

          setMessage(res.displayMsg || res.message || "OTP resent successfully");
          setTimer(180);
          setIsResendDisabled(true);
        } else {
          setMessage(res?.message || "Failed to send OTP. Please try again.");
        }
      } else {
        setMessage(result?.statusMessage || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("❌ OTP resend error:", err);

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
          <Text allowFontScaling={false} style={styles.welcomeText}>Verify OTP</Text>
          <Text allowFontScaling={false} style={styles.title}>Enter code</Text>
          <Text style={styles.messageText} allowFontScaling={false}>
            {message || ''}
          </Text>
          <OTPInput length={6} otp={otp} setOtp={handleOTPChange} isOtpValid={isOtpValid} />


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
  messageText: {
    color: Colors.darkGrey,
    fontSize: 15,
    marginVertical: responsiveHeight(0.5),
    fontFamily: Fonts.Medium600,
  },

});

export default RedeemAmountOtpVerify;
