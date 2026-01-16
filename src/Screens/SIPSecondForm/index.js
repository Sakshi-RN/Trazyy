import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
  SafeAreaView
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPSecondProgress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { WebView } from 'react-native-webview';
import Loader from '../../Components/Loader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from '../../Components/ModalDropdown';
import { Fonts } from '../../Themes/Fonts';
import CustomBackButton from '../../Components/CustomBackButton';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';

const SIPSecondForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();
  const { selected_amount, ids } = route.params || {};

  const { refreshCartCounts } = useCartCounts();
  const [isMandateLoading, setIsMandateLoading] = useState(false);
  const [isCreatingMandate, setIsCreatingMandate] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [razorPayUrl, setRazorPayUrl] = useState('');
  const webViewRef = useRef(null);

  const [mandateList, setMandateList] = useState([]);
  const [selectedMandate, setSelectedMandate] = useState(null);
  const [mandateOptionList, setMandateOptionList] = useState([]);
  const [selectedMandateOption, setSelectedMandateOption] = useState(null);
  const [mandateLimit, setMandateLimit] = useState('');
  const [mandateExists, setMandateExists] = useState(false);

  const [showMandateModal, setShowMandateModal] = useState(false);
  const [showMandateOptionModal, setShowMandateOptionModal] = useState(false);
  const [limitError, setLimitError] = useState('');
  const [mandateError, setMandateError] = useState('');

  const [mandateId, setMandateId] = useState(null);
  const [purchasePlanIds, setPurchasePlanIds] = useState([]);
  const [formattedAmount, setFormattedAmount] = useState('');
  const isHandledRef = useRef(false);

  useEffect(() => {
    if (selected_amount) {
      const raw = String(selected_amount);
      setMandateLimit(raw);
      setFormattedAmount(`₹${Number(raw).toLocaleString('en-IN')}.00`);
    }
  }, [selected_amount]);

  useEffect(() => {
    const initMandates = async () => {
      setIsMandateLoading(true);
      await Promise.all([fetchMandateTypes(), fetchMandateOptions()]);
      setIsMandateLoading(false);
    };
    initMandates();
  }, []);

  const fetchMandateOptions = async () => {
    try {
      const clientId = await AsyncStorage.getItem('clientID');
      if (!clientId) return;
      const res = await axios.get(
        `${baseURL}${endpoints.GET_MANDATE_STATUS}${clientId}`
      );

      if (res.data?.status) {
        const exists = res.data?.response?.mandateExists || false;
        setMandateExists(exists);

        if (exists) {
          const mandates = res.data?.response?.mandates || [];
          const transformedList = mandates.map(item => ({
            label: item.option,
            MANDATE_ID: item.id,
            mandate_status: item.mandate_status,
            ...item,
          }));
          setMandateOptionList(transformedList);
          if (transformedList.length > 0) {
            setSelectedMandateOption(transformedList[0]);
          }
        }
      } else {
        setMandateExists(false);
      }
    } catch (error) {
      console.error('Error fetching mandate options:', error);
      setMandateExists(false);
    }
  };

  const fetchMandateTypes = async () => {
    try {
      const res = await axios.get(
        `${baseURL}${endpoints.MANDATE_TYPE}`
      );
      if (res.data?.status && res.data?.response?.length > 0) {
        const transformedList = res.data.response.map(item => ({
          label: item.masterValueDesc,
          ...item,
        }));
        setMandateList(transformedList);
      } else {
        setMandateList([]);
      }
    } catch (error) {
      console.error('Error fetching mandate types:', error);
    }
  };


  const handleNext = async () => {
    setMandateError('');
    setLimitError('');

    if (!selectedMandate) {
      setMandateError('Please select a mandate type');
      return;
    }

    if (!mandateLimit) {
      setLimitError('Please enter mandate limit');
      return;
    }


    const enteredLimit = Number(mandateLimit);
    const sipAmount = Number(selected_amount);

    if (enteredLimit < sipAmount) {
      setLimitError('Limit Amount must be equal or greater than SIP Amount');
      return;
    }
    try {
      setIsCreatingMandate(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        Alert.alert('Error', 'No client ID found');
        return;
      }

      const payload = {
        client_id: Number(ClientId),
        mandate_type: selectedMandate?.label,
        mandate_limit: enteredLimit,
        payment_postback_url: 'investek://payment_success',
        purchase_plan_ids: ids || [],
      };

      const response = await axios.post(
        `${baseURL}${endpoints.CREATE_MANDATE}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const res = response.data;

      if (res?.status && res?.response?.data?.token_url) {
        const tokenUrl = res.response.data.token_url;
        const mandateIdRes = res.response.mandate_id;
        const planIds = res.response.purchase_plan_ids || [];

        setMandateId(mandateIdRes);
        setPurchasePlanIds(planIds);
        setRazorPayUrl(tokenUrl);
        setShowWebView(true);
      } else {
        Alert.alert('Error', res?.response?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('API Error', error?.message || 'Failed to submit consent');
    } finally {
      setIsCreatingMandate(false);
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
          name: "SIPConsentForm", params: {
            mandate_id: mandateId,
            purchase_plan_ids: purchasePlanIds
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
      navigation.reset({
        index: 0,
        routes: [{ name: "SIPSuccessPage", params: { paymentID: purchaseIds } }],
      });
      return false;
    }

    return true;
  };

  const handleConsentScreen = () => {
    if (selectedMandateOption) {
      navigation.navigate('SIPConsentForm', {
        mandate_id: mandateId || selectedMandateOption.MANDATE_ID,
        purchase_plan_ids: purchasePlanIds.length ? purchasePlanIds : ids || [],
        MANDATE_ID: selectedMandateOption.MANDATE_ID,
        MANDATE_STATUS: selectedMandateOption.mandate_status,
      });
    } else {
      Alert.alert('Warning', 'Please select a mandate option');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
          {showWebView ? (
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <WebView
              ref={webViewRef}
              source={{ uri: razorPayUrl }}
             style={{ flex: 1, marginBottom: Platform.OS === 'ios' ? responsiveHeight(10) : responsiveHeight(10),marginHorizontal:responsiveWidth(6) }}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            />
            </SafeAreaView>
          ) : (
            <>
              <CustomHeader title="SIP Purchase" showBack onBack={() => navigation.goBack()} />
              <SIPSecondProgress style={styles.progressbarStyle} />
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                  {isMandateLoading ? (
                    <View style={styles.centerloader}>
                      <Loader />
                    </View>
                  ) : mandateExists ? (
                    <NewMandateContainer
                      selectedMandateOption={selectedMandateOption}
                      setShowMandateOptionModal={setShowMandateOptionModal}
                      showMandateOptionModal={showMandateOptionModal}
                      mandateOptionList={mandateOptionList}
                      setSelectedMandateOption={setSelectedMandateOption}
                    />
                  ) : (
                    <MandatePayment
                      selectedMandate={selectedMandate}
                      setShowMandateModal={setShowMandateModal}
                      mandateError={mandateError}
                      formattedAmount={formattedAmount}
                      setLimitError={setLimitError}
                      setMandateLimit={setMandateLimit}
                      setFormattedAmount={setFormattedAmount}
                      limitError={limitError}
                      showMandateModal={showMandateModal}
                      mandateList={mandateList}
                      setSelectedMandate={setSelectedMandate}
                    />
                  )}
                  <View style={styles.btnRowss}>
                    <CustomBackButton
                      title="Back"
                      onPress={() => navigation.goBack()}
                    />
                    <CustomButton
                      buttonStyle={styles.submitbtn}
                      title={isCreatingMandate ? <Loader /> : "Invest Now"}
                      onPress={mandateExists ? handleConsentScreen : handleNext}
                      disabled={isCreatingMandate}
                    />
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const MandatePayment = ({
  selectedMandate,
  setShowMandateModal,
  mandateError,
  formattedAmount,
  setLimitError,
  setMandateLimit,
  setFormattedAmount,
  limitError,
  showMandateModal,
  mandateList,
  setSelectedMandate
}) => (
  <View>
    <Text style={styles.headingText}>Set Payment Mandate</Text>
    <CustomTextInput
      placeholder="Select Mandate Type"
      // iconName="chevron-down"
      isDropdown
      value={selectedMandate ? selectedMandate.label : ''}
      editable={false}
      onPress={() => setShowMandateModal(true)}
      title="Mandate Type"
    />
    {mandateError ? <Text style={styles.errorText}>{mandateError}</Text> : null}

    <CustomTextInput
      placeholder="Enter Limit Amount"
      value={formattedAmount}
      title="Limit Amount"
      onChangeText={text => {
        setLimitError('');
        // extract numeric value only
        let cleanValue = text.replace(/\D/g, '');
        setMandateLimit(cleanValue);
        if (cleanValue.length > 0) {
          setFormattedAmount(`₹${Number(cleanValue).toLocaleString('en-IN')}`);
        } else {
          setFormattedAmount('');
        }
      }}
      keyboardType="numeric"
    />

    {limitError ? <Text style={styles.errorText}>{limitError}</Text> : null}
    <ModalDropdown
      visible={showMandateModal}
      data={mandateList}
      labelKey="label"
      onSelect={setSelectedMandate}
      onClose={() => setShowMandateModal(false)}
    />
  </View>
);

const NewMandateContainer = ({
  selectedMandateOption,
  setShowMandateOptionModal,
  showMandateOptionModal,
  mandateOptionList,
  setSelectedMandateOption
}) => (
  <View>
    <CustomTextInput
      placeholder="Select Mandate"
      // iconName="chevron-down"
      isDropdown
      value={selectedMandateOption ? selectedMandateOption.label : ''}
      editable={false}
      onPress={() => setShowMandateOptionModal(true)}
      title="Mandate"
    />
    <ModalDropdown
      visible={showMandateOptionModal}
      data={mandateOptionList}
      onSelect={setSelectedMandateOption}
      onClose={() => setShowMandateOptionModal(false)}
    />
  </View>
);


const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3)
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  centerloader: {
    alignSelf: 'center',
    marginTop: responsiveHeight(2)
  },
  inputWidth: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: responsiveWidth(38),
    paddingVertical: responsiveHeight(1.1),
  },
  submitbtn: {
    width: responsiveWidth(42),
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
    marginBottom: responsiveHeight(3),

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
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700,
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
    fontFamily: Fonts.Semibold700,
    lineHeight: 24,
    width: responsiveWidth(80)
  },
  secureNowText: {
    color: Colors.newGreen
  },
  headingText: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
  },
  limitAmountText: {
    color: Colors.darkGrey,
    fontSize: 14,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(2)
  },
  amountValue: {
    color: Colors.grey,
    fontFamily: Fonts.Medium600,
  }
});

export default SIPSecondForm;







