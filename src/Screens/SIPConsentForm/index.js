import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPConsentProgress } from '../../Assets/svg';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import { Fonts } from '../../Themes/Fonts';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const SIPConsentForm = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { mandate_id, purchase_plan_ids, MANDATE_ID, MANDATE_STATUS } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [mandateStatus, setMandateStatus] = useState(MANDATE_STATUS || null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('⚠️ No client ID found in AsyncStorage');
        setSubmitLoading(false);
        return;
      }

      const bodyData = {
        client_id: Number(ClientId), // ensure it's a number
        purchase_plan_ids: purchase_plan_ids, // plural key
        mandate_id: mandate_id || MANDATE_ID, // fallback for route
      };

      const res = await axios.post(
        `${baseURL}${endpoints.MF_SIP_CONSENT_OTP}`,
        bodyData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const apiResponse = res?.data;


      if (apiResponse?.status && apiResponse?.response?.status) {
        const { mandate_id, purchase_plan_ids, displayMsg } = apiResponse.response;
        setTimeout(() => {
          navigation.navigate('SIPOtpVerify', {
            mandate_id,
            purchase_plan_ids,
            displayMsg
          });
        }, 500);
      } else {
        Alert.alert('Error', apiResponse?.response?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit, please try again');
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleRetry = () => {
    navigation.navigate('Home');
  };




  useEffect(() => {
    const actualMandateId = mandate_id || MANDATE_ID;

    const fetchMandate = async () => {
      if (!actualMandateId) {
        console.warn('No mandate ID found, cannot fetch status.');
        setMandateStatus('fail');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${baseURL}${endpoints.GET_MANDATE_BY_ID}${mandate_id}`
        );

        if (res.data?.status && res.data?.response?.status) {
          setMandateStatus(res.data.response.mandate_status);
        } else {
          setMandateStatus('fail');
        }
      } catch (err) {
        console.error('Error fetching mandate:', err);
        setMandateStatus('fail');
      } finally {
        setLoading(false);
      }
    };

    if (MANDATE_STATUS) {
      setMandateStatus(MANDATE_STATUS);
      setLoading(false);
    }
    else if (actualMandateId) {
      fetchMandate();
    }
    else {
      console.warn('SIPConsentForm: No MANDATE_STATUS or mandate_id provided.');
      setMandateStatus('fail');
      setLoading(false);
    }

  }, [mandate_id, MANDATE_ID, MANDATE_STATUS]);

  const RenderPaymentSuccess = () => (
    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
      <Text allowFontScaling={false} style={styles.textStyle}>
       Mutual fund investments are subject to market risks and Past performance is not indicative of future results. 
       We shall not be liable for any loss arising from market movements, scheme performance, or decisions taken by
        the Asset Management Company (AMC). By clicking <Text style={styles.termsStyle}> "I Agree"</Text> , you consent to the terms and conditions governing 
        this transaction and authorize execution of the investment accordingly.
      </Text>
      <View style={styles.btnRowss}>
        <CustomBackButton
          title="Back"
          onPress={handleGoBack}
        />
        <CustomButton
          buttonStyle={styles.submitbtn}
          onPress={handleSubmit}
          title={submitLoading ? <Loader /> : 'Agree'}
        />
      </View>
    </View>
  );

  const RenderPaymentFail = () => (
    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        Mandate approval unsuccessful.
      </Text>
      <CustomButton buttonStyle={styles.retryBtn} title="Retry" onPress={handleRetry} />
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="SIP Purchase" showBack={true} />
      <SIPConsentProgress style={styles.progressbarStyle} />
      {(mandateStatus === 'success' || MANDATE_STATUS === 'APPROVED') ? (
        <RenderPaymentSuccess />
      ) : (
        <RenderPaymentFail />
      )}
    </View>
  );
};


const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3)
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  inputWidth: {
    borderColor: Colors.lightgrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '47%',
  },
  submitbtn: {
    paddingHorizontal: responsiveWidth(8),
    width: '50%',
  },
  errorText: {
    color: Colors.red,
    fontSize: 18,
    marginTop: responsiveHeight(1),
    fontWeight: '500'
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(2)
  },
  inputViewStyle: {
    borderColor: Colors.lightgrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
    width: '47%',

  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    marginTop: responsiveHeight(0.5),
  },

  cancelText: {
    color: Colors.grey,
  },
  blueContainerStyle: {
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    marginHorizontal: responsiveWidth(5)

  },
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portfolioText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(70),
    lineHeight: 24
  },
  secureNowText: {
    color: Colors.newGreen
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  label: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
  },
  textStyle: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(2),
    alignSelf:'center',
    textAlign:'center'
  },
  termsStyle: {
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  },
  retryBtn: {
    marginVertical: responsiveHeight(3),
    alignSelf: 'center'
  },
  centerloader: {
    alignSelf: 'center',
    marginTop: responsiveHeight(5)
  },

});

export default SIPConsentForm;
