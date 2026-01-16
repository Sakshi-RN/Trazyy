import { useState, useEffect, useRef } from 'react';
import {
  Text, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, View, Alert,SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import OTPInput from '../../Components/OTPInput';
import CustomButton from '../../Components/CustomButton';
import { Logo } from '../../Assets/svg';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Loader from '../../Components/Loader';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';


const LumpSumpOtpVerify = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { displayMsg, oldIds, purchaseIds } = route.params || {};
  const { refreshCartCounts } = useCartCounts();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(180);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [razorPayUrl, setRazorPayUrl] = useState('');

  const webViewRef = useRef(null);
  const isHandledRef = useRef(false);

  const handleOTPChange = (newOtp) => {
    setOtp(newOtp);
    setIsOtpValid(true);
    setMessage("");
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
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
      const clientId = await AsyncStorage.getItem('clientID');

      const { client_id = clientId } = route.params || {};

      const body = {
        client_id,
        otp: otpString,
        purchase_ids: purchaseIds,
        old_ids: oldIds,
      };

      const response = await fetch(
        `${baseURL}${endpoints.VERIFY_MF_UPDATE_CONSENT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();

      if (response.ok && json?.status && json?.statusCode === "0") {
        const res = json.response;
        if (res?.status === true) {
          const tokenUrl = res?.data?.token_url;
          if (tokenUrl) {
            setRazorPayUrl(tokenUrl);
            setShowWebView(true);
          } else {
            setMessage("Token URL missing in response.");
          }
        } else {
          setMessage(res?.message || "Consent verification failed");
        }
      } else {
        const errMsg =
          json?.response?.apiError?.error?.message ||
          json?.statusMessage ||
          "Something went wrong.";
        setMessage(errMsg);
      }
    } catch (error) {
      console.error("❌ verifyMFAndUpdateConsent Error:", error);
      setMessage("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    if (isHandledRef.current) return false;

    if (
      url.includes("payment_success") ||
      url.startsWith("investek://payment_success")
    ) {
      isHandledRef.current = true;
      setShowWebView(false);
      refreshCartCounts();
      navigation.reset({
        index: 0,
        routes: [{
          name: "OneTimeSucessPage", params: {
            paymentID: purchaseIds
          }
        }],
      });
      return false;
    }

    if (
      url.includes("payment_failure") ||
      url.includes("cancel") ||
      url.includes("failure")
    ) {
      isHandledRef.current = true;
      setShowWebView(false);
      refreshCartCounts();
      navigation.reset({
        index: 0,
        routes: [{ name: "OneTimeSucessPage", params: { paymentID: purchaseIds } }],
      });
      return false;
    }

    return true;
  };

  const handleResend = async () => {
    if (!purchaseIds.length || !oldIds.length) {
      Alert.alert("Error", "Missing purchase details. Please try again.");
      return;
    }
    try {
      const clientId = await AsyncStorage.getItem("clientID");
      if (!clientId) {
        Alert.alert("Error", "Client ID not found. Please try again.");
        return;
      }

      const body = {
        client_id: Number(clientId),
        purchase_ids: purchaseIds,
        old_ids: oldIds,
      };

      const response = await axios.post(
        `${baseURL}${endpoints.MF_CONSENT_OTP}`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data?.status && data?.statusCode === "0" && data?.statusMessage === "Success") {
        const res = data.response;

        if (res?.status && !res?.error) {
          setTimer(180);
          setIsResendDisabled(true);
        } else {
          Alert.alert("Failed", res?.message || "Failed to send OTP. Please try again.");
        }
      } else {
        Alert.alert("Error", data?.statusMessage || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP resend error:", error.message);
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
          {showWebView ? (
             <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <WebView
              ref={webViewRef}
              source={{ uri: razorPayUrl }}
           style={{ flex: 1, marginBottom: Platform.OS === 'ios' ? responsiveHeight(10) : responsiveHeight(10) }}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            />
            </SafeAreaView>
          ) : (
            <>
              <Logo style={styles.headingText} />
              <Text allowFontScaling={false} style={styles.welcomeText}>Verify OTP</Text>
              <Text allowFontScaling={false} style={styles.title}>Enter code</Text>
              <Text style={styles.messageText} allowFontScaling={false}>
                {displayMsg || ''}
              </Text>

              <OTPInput length={6} otp={otp} setOtp={handleOTPChange} isOtpValid={isOtpValid} />

              {message !== "" && (
                <Text style={[
                  styles.message,
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
            </>
          )}
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

export default LumpSumpOtpVerify;
