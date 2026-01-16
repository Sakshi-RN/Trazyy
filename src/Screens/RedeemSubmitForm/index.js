import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { useState } from 'react';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomTextInput from '../../Components/CustomTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';


const RedeemSubmitForm = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { schemeData } = route.params || {};

  const [formattedAmount, setFormattedAmount] = useState('');
  const [amount, setAmount] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redeemableAmount = schemeData?.redeemableAmount || 0;


  const formatWithCurrency = (num) => {
    if (!num) return '';
    return `₹${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const handleChange = (text) => {
    setErrorMsg('');
    let raw = text.replace(/[^\d.]/g, '');
    if (!raw) {
      setAmount('');
      setFormattedAmount('');
      return;
    }

    const amt = parseFloat(raw);

    if (isNaN(amt)) return;

    if (amt > redeemableAmount) {
      setErrorMsg(`Amount should not exceed ₹${redeemableAmount.toLocaleString('en-IN')}`);
    }

    setAmount(raw);
    setFormattedAmount(formatWithCurrency(raw));
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    // Remove ₹ and commas to get numeric value
    const redeemable = Number(redeemableAmount.toString().replace(/[^0-9.-]+/g, ""));
    const amt = Number(amount);

    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Redeem amount must be greater than zero.');
      return;
    }

    if (amt > redeemable) {
      setErrorMsg(`Redeem amount cannot exceed ₹${redeemable.toLocaleString('en-IN')}`);
      return;
    }


    // Reject floats
    if (amt !== Math.floor(amt)) {
      setErrorMsg('Redeem amount must be a whole number (no decimals allowed).');
      return;
    }


    if (!agree) {
      setErrorMsg('Please agree to the terms before proceeding.');
      return;
    }

    try {
      setLoading(true);

      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        setLoading(false);
        return;
      }

      const body = {
        client_id: ClientId,
        scheme: schemeData?.scheme,
        folio_number: schemeData?.folioNumber,
        amount: amt,
      };

      const res = await axios.post(
        `${baseURL}${endpoints.PURCHASE_REDEMPTION}`,
        body
      );
      const { response } = res.data || {};
      if (response?.status === true) {
        const purchaseId = response?.data?.purchase_id;
        if (!purchaseId) {
          console.warn('No purchase_id found in API response');
          setErrorMsg('Purchase ID missing in response.');
          setLoading(false);
          return;
        }
        navigation.navigate('RedeemAmountOtpVerify', {
          purchase_id: purchaseId,
        });
      } else if (response?.message?.includes('Validation Error')) {
        setErrorMsg('Validation Error: Missing required fields.');
      } else if (response?.message?.includes('API Error')) {
        setErrorMsg('Invalid amount. Please enter a whole number (no decimals) or less than or equal to redeem amount.');
      } else {
        setErrorMsg(response?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('❌ API Error =>', error);
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const renderSchemeView = () => (
    <View>
      <Text allowFontScaling={false} style={styles.title}>

        {schemeData?.name || 'N/A'}{schemeData?.scheme ? ` (${schemeData?.scheme})` : ''}
      </Text>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.label}>
          Last Recorded NAV
        </Text>
        <Text allowFontScaling={false} style={styles.label}>
          Value at NAV
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>
          {schemeData?.navValue} as on
        </Text>
        <Text allowFontScaling={false} style={styles.value}>
          {schemeData?.valueAtNav}
        </Text>
      </View>
      <Text allowFontScaling={false} style={styles.priceText}>
        {schemeData?.navDate}
      </Text>
    </View>
  );

  const ConsentCheck = () => (
    <View>
      <Text allowFontScaling={false} style={styles.textStyle}>
        By proceeding, you confirm that you have read and understood the Scheme Information Document (SID),
        Key Information Memorandum (KIM), and agree to the{' '}
        <Text style={styles.termsStyle}>terms and conditions.</Text>
      </Text>
      <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
        <Icon
          name={agree ? 'check-square' : 'square-o'}
          size={18}
          color={Colors.blue}
        />
        <Text allowFontScaling={false} style={styles.consentLabel}>
          I agree
        </Text>
      </TouchableOpacity>
    </View>
  );

  const redeemBox = () => (
    <View style={CommonStyles.containerBox}>
      <CustomTextInput
        value={formattedAmount}
        placeholder="Enter Amount to be redeemed"
        keyboardType="numeric"
        title={'Amount to be redeemed'}
        onChangeText={handleChange}
      />

      <Text allowFontScaling={false} style={styles.msgText}>
        Amount must be less than or equal to {redeemableAmount.toLocaleString('en-IN')}
      </Text>

      {errorMsg ? (
        <Text allowFontScaling={false} style={styles.errorText}>
          {errorMsg}
        </Text>
      ) : null}
      {ConsentCheck()}
      <View style={styles.btnRowss}>
        <CustomBackButton
          title="Back"
          onPress={() => navigation.goBack()}
        />
        <CustomButton
          title={loading ? <Loader /> : 'Submit'}
          buttonStyle={[
            styles.submitBtn,
            (!agree || !amount || loading) && { backgroundColor: Colors.lightggrey },
          ]}
          onPress={handleSubmit}
          disabled={!agree || !amount || loading}
        />
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Redeem" showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSchemeView()}
        {redeemBox()}
      </ScrollView>
    </View>
  );
};

export default RedeemSubmitForm;


const styles = StyleSheet.create({

  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(6),
    marginBottom: responsiveHeight(2)
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.blue,
    width: responsiveWidth(40)
  },
  submitBtn: {
    width: responsiveWidth(40)
  },


  title: {
    fontSize: 20,
    fontFamily: Fonts.Semibold700,
    marginVertical: responsiveHeight(1.5),

  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(0.5)
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(0.3)
  },
  RowTopStyle: {
    marginTop: responsiveHeight(1)
  },
  label: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    width: responsiveWidth(35)
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.grey,
    width: responsiveWidth(35)
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,
    marginBottom: responsiveHeight(1.5),
    marginTop: responsiveHeight(0.3)
  },
  scrollContent: {
    paddingBottom: responsiveHeight(13),
    paddingHorizontal: responsiveWidth(5),
  },
  ViewText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  },
  textStyle: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(12)
  },
  termsStyle: {
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  },
  consentLabel: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  },
  msgText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  }
});
