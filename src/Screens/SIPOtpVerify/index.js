import { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import OTPInput from '../../Components/OTPInput';
import CustomButton from '../../Components/CustomButton';
import { Logo } from '../../Assets/svg';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';

const SIPOtpVerify = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { displayMsg, oldIds, purchase_plan_ids } = route.params || {};

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(180);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { refreshCartCounts } = useCartCounts();

  const handleOTPChange = (newOtp) => {
    setOtp(newOtp);
    setIsOtpValid(true);
    setMessage('');
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setMessage('The OTP must be 6 digits long.');
      return;
    }

    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');

      if (!clientId) {
        Alert.alert('Error', 'Client ID not found. Please try again.');
        setLoading(false);
        return;
      }

      const body = {
        client_id: Number(clientId),
        otp: otpString,
        purchase_plan_ids: purchase_plan_ids,
      };


      const response = await fetch(
        `${baseURL}${endpoints.VERIFY_MF_UPDATE_SIP_CONSENT}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();

      if (response.ok && json?.status && json?.statusCode === '0' && json?.response?.status) {
        const finalPurchaseIds = json?.response?.data?.purchase_plan_ids || purchase_plan_ids;
        try {
          const updateBody = {
            purchase_ids: finalPurchaseIds,
            type: "sip"
          };


          const updateResponse = await axios.put(
            `${baseURL}${endpoints.UPDATE_CART_STATUS}`,
            updateBody,
            { headers: { "Content-Type": "application/json" } }
          );

        } catch (updateError) {
          console.error("❌ Error updating cart status:", updateError);
        }
        refreshCartCounts();
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'SIPSuccessPage',
                params: {
                  purchase_ids: finalPurchaseIds,
                },
              },
            ],
          });
        }, 300);

      } else {
        const errMsg =
          json?.response?.message ||
          json?.response?.apiError?.error?.message ||
          json?.statusMessage ||
          'Consent verification failed.';
        setMessage(errMsg);
      }
    } catch (error) {
      console.error('❌ verifyMFAndUpdateSipConsent Error:', error);
      setMessage('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    try {
      const clientId = await AsyncStorage.getItem('clientID');
      if (!clientId) {
        Alert.alert('Error', 'Client ID not found. Please try again.');
        return;
      }

      const body = {
        client_id: Number(clientId),
      };
      const response = await axios.post(
        `${baseURL}${endpoints.RESEND_CONSENT_OTP}`,
        body,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      if (
        data?.status === true &&
        data?.statusCode === '0' &&
        data?.response?.status === true
      ) {
        const res = data.response;
        Alert.alert('Success', res?.displayMsg || res?.message || 'OTP sent successfully.');
        setTimer(180);
        setIsResendDisabled(true);
      } else {
        const msg =
          data?.response?.message ||
          data?.statusMessage ||
          'Failed to resend OTP. Please try again.';
        Alert.alert('Error', msg);
      }
    } catch (error) {
      console.error('❌ Resend OTP API Error:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while resending OTP. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.content}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Logo style={styles.headingText} />
          <Text allowFontScaling={false} style={styles.welcomeText}>Verify OTP</Text>
          <Text allowFontScaling={false} style={styles.title}>Enter code</Text>
          <Text style={styles.messageText} allowFontScaling={false}>
            {displayMsg || ''}
          </Text>
          <OTPInput length={6} otp={otp} setOtp={handleOTPChange} isOtpValid={isOtpValid} />
          {message !== '' && (
            <Text
              style={[
                styles.message,
                message.includes('successfully') ? styles.successText : styles.errorText,
              ]}
            >
              {message}
            </Text>
          )}

          {isResendDisabled ? (
            <Text allowFontScaling={false} style={styles.resendText}>
              Send code again {timer > 0 ? formatTime(timer) : ''}
            </Text>
          ) : (
            <View>
              <Text style={styles.touchableResendText} allowFontScaling={false}>
                I didn’t receive a code.{' '}
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

export default SIPOtpVerify;
