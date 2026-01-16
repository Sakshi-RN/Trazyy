import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Text
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPFirstprogress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ModalDropdown from '../../Components/ModalDropdown';
import axios from 'axios';
import { Fonts } from '../../Themes/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const STPDetails = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();

  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [categoryName, setCategoryName] = useState('');
  const [investmentOption, setInvestmentOption] = useState('');
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [schemeLoading, setSchemeLoading] = useState(false);



  const fetchFundSchemes = async (value) => {
    try {
      setSchemeLoading(true);
      const response = await axios.get(`${baseURL}${endpoints.GET_FUND_SCHEMES_SIP}${value}`);
      const data = response.data.response?.data || [];
      const formatted = data.map(item => ({
        label: item?.fund_scheme_name,
        value: item?.isin,
        fund_category: item?.fund_category,
        investment_option: item?.investment_option,
        frequencies: item?.frequencies || []
      }));
      setSchemeList(formatted);
    } catch (error) {
      console.error('Fund Scheme Error:', error);
    } finally {
      setSchemeLoading(false);
    }
  };



  const handleSelectScheme = (item) => {
    setSelectedScheme(item)
  };

  const handleNext = () => {
    let newErrors = {};
    if (!selectedScheme) newErrors.selectedScheme = "Please select a scheme.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    navigation.navigate("SIPNewForm")
  };

  const renderSchemeView = () => (
    <View>
      <Text allowFontScaling={false} style={styles.title}>SBI Contra Fund - Regular Plan - Growth</Text>
      <Text allowFontScaling={false} style={styles.label}>Last Recorded NAV</Text>
      <Text allowFontScaling={false} style={styles.value}>₹374.8081 as on 06-Aug-2025</Text>
      <Text allowFontScaling={false} style={styles.label}>Value at NAV</Text>
      <Text allowFontScaling={false} style={styles.value}>₹24,420.25</Text>
      <Text allowFontScaling={false} style={styles.label}>Folio No.</Text>
      <Text allowFontScaling={false} style={styles.value}>XZ1234095233324</Text>
      <Text allowFontScaling={false} style={styles.label}>Scheme Option</Text>
      <Text allowFontScaling={false} style={styles.value}>Growth</Text>
    </View>
  );

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(12) }]}>
      <CustomHeader title="System Transfer Plan" showBack={true} />
      <SIPFirstprogress style={styles.progressbarStyle} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
            {renderSchemeView()}
            <CustomTextInput
              value={selectedScheme?.label || ''}
              placeholder="Select Scheme Name"
              // iconName="chevron-down"
              isDropdown={true}
              title={'Scheme Name'}
              editable={false}
              onPress={() => setShowSchemeModal(true)}
            />
            {errors.selectedScheme && <Text allowFontScaling={false} style={styles.errorText}>{errors.selectedScheme}</Text>}
            <View style={styles.btnRowss}>
              <CustomBackButton title="Cancel" onPress={() => navigation.goBack()} />
              <CustomButton buttonStyle={styles.submitbtn} textStyle={styles.submtText} title="Next" onPress={handleNext} />
            </View>
            <ModalDropdown visible={showSchemeModal} data={schemeList} onSelect={handleSelectScheme} onClose={() => setShowSchemeModal(false)} loading={schemeLoading} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(3),
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginVertical: responsiveHeight(2)
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
    width: '48%',
  },
  submitbtn: {
    width: '48%',
  },

  valuesText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },
  schemeText: {
    color: Colors.grey,
    fontSize: 11,
    fontFamily: Fonts.Semibold700
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
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
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
    fontFamily: Fonts.Semibold700
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  titleText: {
    fontSize: 13,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(1),
    fontWeight: 'bold'
  },
  inputText: {
    fontSize: 12,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
    fontWeight: '400'
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(1),

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
    color: Colors.grey,
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    marginTop: responsiveHeight(1)
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.black,
    marginTop: responsiveHeight(0.2)
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.black,
    marginBottom: responsiveHeight(1.5),
    marginTop: responsiveHeight(0.3)
  },

});

export default STPDetails;
