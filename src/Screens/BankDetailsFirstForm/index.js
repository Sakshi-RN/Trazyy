import { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { BankFirstprogress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ModalDropdown from '../../Components/ModalDropdown';
import { Fonts } from '../../Themes/Fonts';
import Loader from '../../Components/Loader';
import getEnvVars from '../../utils/config';
import CustomBackButton from '../../Components/CustomBackButton';


const BankDetailsFirstForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();

  const [formData, setFormData] = useState({
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    accountHolder: '',
    bankType: '',
  });

  const [errors, setErrors] = useState({});
  const [bankTypeList, setBankTypeList] = useState([]);
  const [isBankTypeModalVisible, setIsBankTypeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };


  const toggleBankTypeModal = () => setIsBankTypeModalVisible(!isBankTypeModalVisible)

  const selectBankType = (selected) => {
    handleChange('bankType', selected.label);
    toggleBankTypeModal();
  };

  const validate = () => {
    const { bankName, ifscCode, accountNumber, accountHolder, bankType } = formData;
    let newErrors = {};

    if (!bankName.trim()) newErrors.bankName = 'Bank Name is required.';
    if (!ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required.';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC format (e.g., UTIB0000124).';
    }
    if (!bankType) newErrors.bankType = 'Please select Account Type.';
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account Number is required.';
    } else if (!/^\d{9,18}$/.test(accountNumber.trim())) {
      newErrors.accountNumber = 'Account Number must be 9-18 digits.';
    }
    if (!accountHolder.trim()) newErrors.accountHolder = 'Account Holder Name is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBankTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}${endpoints.BANK_DETAIL}`
      );
      if (res.data?.status && res.data?.hasRecords) {
        const formatted = res.data.response.map(item => ({
          label: item.masterValueDesc,
          value: item.masterValueDesc,
        }));
        setBankTypeList(formatted);
      } else {
        setBankTypeList([]);
      }
    } catch (err) {
      console.error('Error fetching bank types:', err);
      setBankTypeList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBankDetails = useCallback(async () => {
    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');

      if (!clientId) return console.warn('No client ID found in AsyncStorage');

      const res = await axios.get(
        `${baseURL}${endpoints.GET_BANK_CLEINT}${clientId}`
      );

      if (res.data?.response?.status) {
        const bankData = res.data.response.data || {};
        setFormData({
          bankName: bankData.bank_name || '',
          ifscCode: bankData.ifsc_code || '',
          accountNumber: bankData.account_number || '',
          accountHolder: bankData.primary_account_holder_name || '',
          bankType: bankData.type || '',
        });
      } else {
      }
    } catch (err) {
      console.error('Error fetching bank details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   const pendingScreens = route.params?.pendingScreens;
  //   if (pendingScreens && pendingScreens.length >= 0) {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
  //     return () => backHandler.remove();
  //   }
  // }, [route.params?.pendingScreens]);

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');
      if (!clientId) return console.warn('No client ID found in AsyncStorage');

      const payload = {
        client_id: Number(clientId),
        primary_account_holder_name: formData.accountHolder,
        account_number: formData.accountNumber,
        type: formData.bankType,
        ifsc_code: formData.ifscCode,
        bank_name: formData.bankName,
      };

      const res = await axios.post(
        `${baseURL}${endpoints.ADD_BANK}`,
        payload
      );

      if (res.data?.status) {
        const pendingScreens = route.params?.pendingScreens;
        if (pendingScreens && pendingScreens.length > 0) {
          const next = pendingScreens[0];
          const remaining = pendingScreens.slice(1);
          navigation.navigate(next, { pendingScreens: remaining, nextScreen: remaining[0] });
        } else if (route.params?.nextScreen) {
          navigation.navigate(route.params.nextScreen);
        } else {
          navigation.navigate('BankDetailsSuccessPage');
        }
      } else {
        alert(res.data.response?.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error submitting bank details:', err);
      alert('Failed to submit bank details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankTypes();
    fetchBankDetails();
  }, [fetchBankTypes, fetchBankDetails]);


  const renderAccountType = () => {
    return (
      <View style={styles.radioRow}>
        {bankTypeList.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.radioOption}
            onPress={() => handleChange('bankType', item.value)}
          >
            <View style={[
              styles.radioOuter,
              formData.bankType === item.value && styles.radioSelectedOuter
            ]}>
              {formData.bankType === item.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    )
  }

  const renderForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomTextInput
              placeholder="Enter Bank Name"
              title="Bank Name"
              value={formData.bankName}
              onChangeText={text => handleChange('bankName', text)}
            />
            {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
            <CustomTextInput
              placeholder="Enter IFSC Code"
              title="IFSC Code"
              value={formData.ifscCode}
              onChangeText={text => handleChange('ifscCode', text.toUpperCase())}
            />
            {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
            {/* <CustomTextInput
              placeholder="Select Account Type"
              // iconName="chevron-down"
              isDropdown={true}
              title="Account Type"
              value={formData.bankType}
              onPress={toggleBankTypeModal}
              editable={false}
            /> */}
            {renderAccountType()}
            {errors.bankType && <Text style={styles.errorText}>{errors.bankType}</Text>}
            <CustomTextInput
              placeholder="Enter Account Number"
              title="Account Number"
              value={formData.accountNumber}
              onChangeText={text => handleChange('accountNumber', text)}
              keyboardType="numeric"
            />
            {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
            <CustomTextInput
              placeholder="Enter Account Holder Name"
              title="Account Holder Name"
              value={formData.accountHolder}
              onChangeText={text => handleChange('accountHolder', text)}
            />
            {errors.accountHolder && <Text style={styles.errorText}>{errors.accountHolder}</Text>}
            <View style={styles.btnRowss}>
              <CustomBackButton
                title="Cancel"
                onPress={() => navigation.goBack()}
              />
              <CustomButton
                buttonStyle={styles.submitbtn}
                title={loading ? <Loader /> : 'Submit'}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
      <CustomHeader title="Bank Details" showBack={true} />
      <BankFirstprogress style={styles.progressbarStyle} />
      {renderForm()}
    </View>
  );
};



const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  inputWidth: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
  },

  submitbtn: {
    width: '48%',
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
    marginBottom: responsiveHeight(3)
  },
  inputViewStyle: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
    width: '47%',

  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    justifyContent: 'space-between',
    width: responsiveWidth(42)
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioOuter: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelectedOuter: {
    borderColor: Colors.blue,
  },
  radioInner: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.blue,
  },
  radioLabel: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: Fonts.Bold800,
    fontWeight: 'bold',

  },


});

export default BankDetailsFirstForm;
