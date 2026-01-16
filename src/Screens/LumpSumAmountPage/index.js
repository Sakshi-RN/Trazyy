import { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { LumpsumAmountProgress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';


const LumpSumAmountPage = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { selectedAmc, selectedScheme, categoryName, investmentOption, selectedMandate } = route.params;

  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const { minAmount, maxAmount } = selectedScheme || {};
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const formatWithCurrency = (num) => {
    if (!num) return "";
    return `₹${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };



  const handleChange = (text) => {
    let raw = text.replace(/\D/g, "");
    if (!raw) {
      setAmount("");
      setFormattedAmount("");
      return;
    }
    const amt = parseInt(raw, 10);

    setAmount(raw);
    setFormattedAmount(formatWithCurrency(amt));
  };

  const validate = () => {
    let tempErrors = {};
    if (!amount) {
      tempErrors.amount = "Amount is required.";
    } else if (selectedScheme) {
      const amt = Number(amount);
      const minAmount = selectedScheme.minAmount ?? null;
      const maxAmount = selectedScheme.maxAmount ?? null;

      if (minAmount !== null && amt < minAmount) {
        tempErrors.amount = `Amount must be at least ₹${minAmount.toLocaleString("en-IN")}.`;
      } else if (maxAmount !== null && amt > maxAmount) {
        tempErrors.amount = `Amount must not exceed ₹${maxAmount.toLocaleString("en-IN")}.`;
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        return;
      }

      const response = await axios.post(
        `${baseURL}${endpoints.ADD_LUMPSUM}`,
        {
          client_id: ClientId,
          scheme: selectedScheme?.value,
          amount: parseFloat(amount),
          folio_number: selectedMandate?.label || null,
          amc: selectedAmc?.label,
          category: categoryName,
          option: investmentOption,
        }
      );

      setLoading(false);
      const res = response.data;
      if (res?.response?.status) {
        navigation.navigate('OneTimeSecondForm', {
          purchase_id: res.response.data.purchase_id,
          selected_amount: res.response.data.selected_amount,
          selected_scheme: res.response.data.selected_scheme,
          amc: selectedAmc,
          category: categoryName,
          option: investmentOption,
          folio: selectedMandate,
        });
      } else {
        setErrors({ api: res.response.message || 'Something went wrong.' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ api: 'API call failed. Please try again.' });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const addReferalDetails = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
          <CustomTextInput
            value={formattedAmount}
            placeholder="Enter Purchase Amount"
            keyboardType="numeric"
            onChangeText={handleChange}
            title={'Purchase Amount'}
          />
          {selectedScheme?.minAmount != null && selectedScheme?.maxAmount != null && (
            <Text allowFontScaling={false} style={styles.valuesText}>
              Amount allowed between{" "}
              <Text allowFontScaling={false} style={styles.schemeText}>
                {`${formatCurrency(selectedScheme?.minAmount)} and ${formatCurrency(selectedScheme?.maxAmount)}`}
              </Text>
            </Text>
          )}
          {errors.amount && <Text allowFontScaling={false} style={styles.errorText}>{errors.amount}</Text>}
          <View style={styles.btnRowss}>
            <CustomBackButton
              title={'Cancel'}
              onPress={handleGoBack}
            />
            <CustomButton
              buttonStyle={styles.submitbtn}
              textStyle={styles.submtText}
              title={loading ? <Loader /> : "Next"}
              loading={loading}
              onPress={handleNext}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
      <CustomHeader title="Lumpsum" showBack />
      <LumpsumAmountProgress style={styles.progressbarStyle} />
      {addReferalDetails()}
    </View>
  );
};
const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    flex: 0.7
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '48%',
  },
  submitbtn: {
    width: '48%',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
    height: responsiveHeight(55)
  },

  errorText: {
    color: Colors.red,
    fontSize: 13,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700
  },
  valuesText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },
  schemeText: {
    color: Colors.grey
  }
});

export default LumpSumAmountPage;
