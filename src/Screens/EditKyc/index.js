import { useState, useCallback, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Text, Alert, BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Loader from '../../Components/Loader';
import { EditKYCFirstProgress } from '../../Assets/svg';
import CustomCalendarComponent from '../../Components/CustomCalendarComponent';
import { Fonts } from '../../Themes/Fonts';
import ModalDropdown from '../../Components/ModalDropdown';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

// Convert ISO (2023-08-03T00:00:00.000Z) to DD-MM-YYYY
const formatDateForDisplay = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};
// Convert DD-MM-YYYY to API format (YYYY-MM-DD)
const formatDateForAPI = (displayDate) => {
  if (!displayDate) return '';
  const [day, month, year] = displayDate.split('-');
  return `${year}-${month}-${day}`;
};

const EditKyc = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();

  const [loading, setLoading] = useState(true);
  const [nomineeName, setNomineeName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [occupationList, setOccupationList] = useState([]);
  const [incomeRangeList, setIncomeRangeList] = useState([]);
  const [sourceOfIncomeList, setSourceOfIncomeList] = useState([]);
  const [pepList, setPepList] = useState([]);
  const [occupation, setOccupation] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [sourceOfIncome, setSourceOfIncome] = useState('');
  const [pepDetails, setPepDetails] = useState('');
  const [occupationVisible, setOccupationVisible] = useState(false);
  const [incomeRangeVisible, setIncomeRangeVisible] = useState(false);
  const [sourceIncomeVisible, setSourceIncomeVisible] = useState(false);
  const [pepVisible, setPepVisible] = useState(false);
  const [nameError, setNameError] = useState('');
  const [panError, setPanError] = useState('');
  const [cityError, setCityError] = useState('');
  const [occupationError, setOccupationError] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [sourceError, setSourceError] = useState('');
  const [pepError, setPepError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');

      if (!ClientId) {
        Alert.alert('No client ID found');
        return;
      }
      const [occRes, incRes, srcRes, pepRes, nomineeRes] = await Promise.all([
        axios.get(`${baseURL}${endpoints.GET_PROFESSIONS}`),
        axios.get(`${baseURL}${endpoints.GET_INCOME_SLAB}`),
        axios.get(`${baseURL}${endpoints.GET_SOURCE_OF_WEALTH}`),
        axios.get(`${baseURL}${endpoints.GET_PEP}`),
        axios.get(`${baseURL}${endpoints.GET_KYC_DETAILS_BY_CLIENT_ID}${ClientId}`)
      ]);
      setOccupationList(
        occRes.data?.response?.map(r => ({
          label: r.profession_name,
          value: String(r.profession_id)
        })) || []
      );
      setIncomeRangeList(
        incRes.data?.response?.map(r => ({
          label: r.masterValueDesc,
          value: String(r.masterValueId)
        })) || []
      );
      setSourceOfIncomeList(
        srcRes.data?.response?.map(r => ({
          label: r.masterValueDesc,
          value: String(r.masterValueId)
        })) || []
      );
      setPepList(
        pepRes.data?.response?.map(r => ({
          label: r.masterValueDesc,
          value: String(r.masterValueId)
        })) || []
      );
      if (nomineeRes.data?.response?.status) {
        const d = nomineeRes.data.response.data || {};
        setNomineeName(d.nameAsPerPan || '');
        setPanNumber(d.panNumber || '');
        setPlaceOfBirth(d.placeOfBirth || '');
        setDateOfBirth(d.dobOfInvestor || '');
        const occ = occRes.data?.response?.find(o => o.profession_name === d.occupation);
        setOccupation(occ ? String(occ.profession_id) : '');
        const inc = incRes.data?.response?.find(i => i.masterValueDesc === d.investorsIncomeRange);
        setIncomeRange(inc ? String(inc.masterValueId) : '');
        const src = srcRes.data?.response?.find(s => s.masterValueDesc === d.sourceOfIncome);
        setSourceOfIncome(src ? String(src.masterValueId) : '');
        const pep = pepRes.data?.response?.find(p => p.masterValueDesc === d.pepDetails);
        setPepDetails(pep ? String(pep.masterValueId) : '');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to load nominee data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchProfile(); }, [fetchProfile]));

  // useEffect(() => {
  //   const pendingScreens = route.params?.pendingScreens;
  //   if (pendingScreens && pendingScreens.length >= 0) {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
  //     return () => backHandler.remove();
  //   }
  // }, [route.params?.pendingScreens]);

  const handleNext = async () => {
    let valid = true;
    setNameError('');
    setPanError('');
    setCityError('');
    setOccupationError('');
    setIncomeError('');
    setSourceError('');
    setPepError('');

    if (!nomineeName.trim()) {
      setNameError('Name is required.');
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nomineeName)) {
      setNameError('Name should contain only alphabets.');
      valid = false;
    }
    if (!panNumber.trim()) {
      setPanError('PAN Number is required.');
      valid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      setPanError('Please enter a valid PAN number.');
      valid = false;
    }
    if (!placeOfBirth.trim()) {
      setCityError('Place of birth is required.');
      valid = false;
    } else if (!/^[A-Za-z\s.-]+$/.test(placeOfBirth)) {
      setCityError('City should contain only alphabets.');
      valid = false;
    }
    if (!occupation) {
      setOccupationError('Occupation is required.');
      valid = false;
    }
    if (!incomeRange) {
      setIncomeError('Income Range is required.');
      valid = false;
    }
    if (!sourceOfIncome) {
      setSourceError('Source of Income is required.');
      valid = false;
    }
    if (!pepDetails) {
      setPepError('Please select Politically Exposed Person.');
      valid = false;
    }
    if (!valid) return;

    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        Alert.alert('Missing authentication or client ID.');
        return;
      }
      const kycData = {
        clientId: Number(ClientId),
        nameAsPerPan: nomineeName,
        panNumber,
        placeOfBirth,
        dobOfInvestor: dateOfBirth,
        occupation: occupationList.find(o => o.value === occupation)?.label || null,
        investorsIncomeRange: incomeRangeList.find(i => i.value === incomeRange)?.label || null,
        sourceOfIncome: sourceOfIncomeList.find(s => s.value === sourceOfIncome)?.label || null,
        pepDetails: pepList.find(p => p.value === pepDetails)?.label || null,
      };

      const response = await axios.post(
        `${baseURL}${endpoints.ADD_KYC_DETAILS}`,
        kycData,
        {
          headers: { 'Content-Type': 'application/json' },
        }

      );

      if (response.data.status) {
        navigation.navigate('EditNominee', {
          kycResponse: response.data.response.data,
          nextScreen: route.params?.nextScreen,
          pendingScreens: route.params?.pendingScreens // Pass it forward to EditNominee if needed, or handle it there
        });
      } else {
        Alert.alert(response.data.response?.message || 'Failed to update KYC details');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  // Expecting DD-MM-YYYY from calendar
  const dateSelected = (selectedDate) => {
    setDateOfBirth(selectedDate);
    toggleCalendarModal();
  };

  return (
    <View style={[CommonStyles.container, { paddingBottom: Platform.OS === 'ios' ? responsiveHeight(12) : responsiveHeight(16) }]}>
      <CustomHeader title="Edit KYC" showBack={true} />
      <EditKYCFirstProgress style={styles.progressbarStyle} />
      {loading ? (
        <View style={styles.centerLogo}><Loader /></View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
              <CustomTextInput
                value={nomineeName}
                onChangeText={setNomineeName}
                placeholder="Name as per PAN"
                title="Name"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <CustomTextInput
                value={panNumber}
                onChangeText={(t) => { setPanNumber(t.toUpperCase()); setPanError(''); }}
                placeholder="Enter PAN Number"
                title="PAN Number"
                maxLength={10}
              />
              {panError ? <Text style={styles.errorText}>{panError}</Text> : null}
              <CustomTextInput
                title="Date of Birth"
                placeholder="DD-MM-YYYY"
                value={dateOfBirth}
                iconName="calendar"
                onPress={toggleCalendarModal}
                isDropdown={true}
                onPressIcon={toggleCalendarModal}
              />
              <CustomCalendarComponent
                isCalendarModalVisible={isCalendarModalVisible}
                closeCalendarModal={toggleCalendarModal}
                dateSelected={dateSelected}
                current={dateOfBirth}
                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                minimumDate={new Date(1925, 0, 1)}
              />
              <CustomTextInput
                value={placeOfBirth}
                onChangeText={setPlaceOfBirth}
                placeholder="Enter Place of birth"
                title="Place of birth"
              />
              {cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
              <CustomTextInput
                // iconName="chevron-down"
                isDropdown={true}
                value={occupationList.find(o => o.value === occupation)?.label || ''}
                onPress={() => setOccupationVisible(true)}
                title="Occupation"
                placeholder="Select Occupation"
              />
              {occupationError ? <Text style={styles.errorText}>{occupationError}</Text> : null}
              <ModalDropdown
                visible={occupationVisible}
                data={occupationList}
                onSelect={(item) => { setOccupation(item.value); setOccupationVisible(false); }}
                onClose={() => setOccupationVisible(false)}
              />
              <CustomTextInput
                // iconName="chevron-down"
                isDropdown={true}
                value={incomeRangeList.find(i => i.value === incomeRange)?.label || ''}
                onPress={() => setIncomeRangeVisible(true)}
                title="Income Range"
                placeholder="Select Income Range"
              />
              {incomeError ? <Text style={styles.errorText}>{incomeError}</Text> : null}
              <ModalDropdown
                visible={incomeRangeVisible}
                data={incomeRangeList}
                onSelect={(item) => { setIncomeRange(item.value); setIncomeRangeVisible(false); }}
                onClose={() => setIncomeRangeVisible(false)}
              />
              <CustomTextInput
                // iconName="chevron-down"
                isDropdown={true}
                value={sourceOfIncomeList.find(s => s.value === sourceOfIncome)?.label || ''}
                onPress={() => setSourceIncomeVisible(true)}
                title="Source of Income"
                placeholder="Select Source of Income"
              />
              {sourceError ? <Text style={styles.errorText}>{sourceError}</Text> : null}
              <ModalDropdown
                visible={sourceIncomeVisible}
                data={sourceOfIncomeList}
                onSelect={(item) => { setSourceOfIncome(item.value); setSourceIncomeVisible(false); }}
                onClose={() => setSourceIncomeVisible(false)}
              />
              <CustomTextInput
                // iconName="chevron-down"
                isDropdown={true}
                value={pepList.find(p => p.value === pepDetails)?.label || ''}
                onPress={() => setPepVisible(true)}
                title="Politically Exposed Person"
                placeholder="Select Politically Exposed Person"
              />
              {pepError ? <Text style={styles.errorText}>{pepError}</Text> : null}
              <ModalDropdown
                visible={pepVisible}
                data={pepList}
                onSelect={(item) => { setPepDetails(item.value); setPepVisible(false); }}
                onClose={() => setPepVisible(false)}
              />
              <View style={styles.btnRowss}>
                <CustomBackButton
                  title="Cancel"
                  onPress={() => navigation.goBack()}
                />
                <CustomButton
                  buttonStyle={styles.submitbtn}
                  textStyle={styles.submtText}
                  title="Next"
                  onPress={handleNext}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
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
    fontSize: 10,
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
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableEmailTextColor: {
    color: Colors.grey
  }
});

export default EditKyc;
