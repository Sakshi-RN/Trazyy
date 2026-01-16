import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SecondProgress } from '../../Assets/svg';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';



const OneTimeThirdForm = () => {
  const route = useRoute();
  const { purchaseIds = [], oldIds = [] } = route.params || {};
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = async () => {
    if (!purchaseIds.length || !oldIds.length) {
      Alert.alert('Error', 'Missing purchase details. Please try again.');
      return;
    }

    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');
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

      const res = response.data?.response;
      if (res?.status === true) {
        const msg = res.displayMsg || res.message || "OTP sent successfully";

        const purchaseIds = res.purchase_ids || [];
        const oldIds = res.old_ids || [];

        navigation.navigate("LumpSumpOtpVerify", {
          displayMsg: msg,
          purchaseIds,
          oldIds,
        });
      } else {
        Alert.alert('Failed', res?.message || 'Something went wrong');
      }

    } catch (error) {
      console.error("❌ mfConsentOtp Error:", error.response?.data || error.message);
      const errMsg =
        error.response?.data?.response?.message ||
        error.response?.data?.response ||
        "Something went wrong while sending OTP.";
      Alert.alert("Error", errMsg);
    } finally {
      setLoading(false);
    }
  };

  const AddReferalDetails = () => (
    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        By proceeding, you confirm that you have read and understood the Scheme Information Document (SID),
        Key Information Memorandum (KIM), and agree to the <Text style={styles.termsStyle}>terms and conditions.</Text>
      </Text>
      <View style={styles.btnRowss}>
        <CustomBackButton
          title={'Back'}
          onPress={handleGoBack}
        />
        <CustomButton
          textStyle={styles.btnText}
          buttonStyle={styles.submitbtn}
          title={loading ? <Loader /> : "I Agree"}
          disabled={loading}
          onPress={handleNext}
        />
      </View>
    </View>
  );



  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Lumpsum" showBack={true} />
      <SecondProgress style={styles.progressbarStyle} />
      <View style={styles.scrollContent}>
        <AddReferalDetails />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2)
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '45%',
  },
  submitbtn: {
    paddingHorizontal: responsiveWidth(6),
    width: '50%',
  },
  btnText: {
    fontSize: 13,
    fontFamily: Fonts.Semibold700,
  },
  errorText: {
    color: Colors.red,
    fontSize: 18,
    marginTop: responsiveHeight(1),
    fontWeight: '500'
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
  },

  cancelText: {
    color: Colors.grey,
    fontSize: 13,
    fontFamily: Fonts.Semibold700,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  textStyle: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(2)
  },
  termsStyle: {
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  },
  webView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsiveHeight(5),
    height: responsiveHeight(40),
    marginTop: responsiveHeight(2)
  },
});

export default OneTimeThirdForm;
