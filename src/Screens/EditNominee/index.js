import React, { useState, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Text
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import GenderInput from '../../Components/GenderInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomCalendarComponent from '../../Components/CustomCalendarComponent';
import Loader from '../../Components/Loader';
import ModalDropdown from '../../Components/ModalDropdown';
import { Fonts } from '../../Themes/Fonts';
import { NomineeFirstProgress } from '../../Assets/svg';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

// Convert yyyy-mm-dd to dd/mm/yyyy for display
const ymdToDmySlash = (s) => {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

// Convert dd/mm/yyyy to yyyy-mm-dd for API
const dmySlashToYmd = (s) => {
  if (!s) return '';
  const [d, m, y] = s.split('/');
  return `${y}-${m}-${d}`;
};

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

const calculateAge = (dob) => {
  if (!dob) return 0;

  let day, month, year;

  // Handle DD-MM-YYYY or DD/MM/YYYY
  if (dob.includes('-')) {
    [day, month, year] = dob.split('-');
  } else if (dob.includes('/')) {
    [day, month, year] = dob.split('/');
  } else {
    return 0;
  }

  const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};


const EditNominee = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();

  const [loading, setLoading] = useState(true);
  const [relations, setRelations] = useState([]);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isRelationModalVisible, setIsRelationModalVisible] = useState(false);
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeDob, setNomineeDob] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('');
  const [nomineeId, setNomineeId] = useState('');
  const [panError, setPanError] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [nomineePhone, setnomineePhone] = useState('');
  const [dobError, setDobError] = useState('');
  const [relationError, setRelationError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        setGeneralError('No client ID found');
        return;
      }
      const relRes = await axios.get(
        `${baseURL}${endpoints.GET_RELATION}`
      );
      if (relRes.data?.response?.length) {
        setRelations(relRes.data.response.map(r => ({
          id: r.masterValueId,
          label: r.masterValueDesc,
        })));
      } else {
        setRelations([]);
      }

      const res = await axios.get(
        `${baseURL}${endpoints.GET_NOMINEE_DETAILS}${ClientId}`
      );

      if (res.data?.response?.status) {
        const d = res.data.response.data || {};
        setNomineeName(d.nomineeName || '');
        setNomineeDob(d.nomineeDob || '');
        setNomineeRelation(d.nomineeRelationWithInvestor || '');
        setNomineeId((d.nomineeId || '').toUpperCase());
        setNomineeEmail(d.nomineeEmail || '');
        setnomineePhone(d.nomineePhone ? String(d.nomineePhone) : '');
      }
    } catch (err) {
      setGeneralError('Failed to load nominee data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchProfile(); }, [fetchProfile]));

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  // Calendar returns dd/mm/yyyy format directly
  // Calendar returns date → normalize to DD/MM/YYYY
  const dateSelected = (selectedDate) => {
    const formattedDate = selectedDate.replace(/-/g, '/');
    setNomineeDob(formattedDate);
    setDobError('');
    toggleCalendarModal();
  };


  const toggleRelationModal = () => {
    setIsRelationModalVisible(!isRelationModalVisible);
  };

  const selectRelation = (selectedRelation) => {
    setNomineeRelation(selectedRelation.label);
    toggleRelationModal();
  };

  const handleGoBack = () => navigation.goBack();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleNext = async () => {
    let valid = true;

    // 🔹 Clean phone once (FIXES ReferenceError)
    const cleanedPhone = nomineePhone?.replace(/\D/g, '') || '';

    // 🔹 Reset all errors
    setNameError('');
    setRelationError('');
    setDobError('');
    setPanError('');
    setEmailError('');
    setPhoneError('');
    setGeneralError('');

    /* ===========================
       Mandatory fields (ALL AGES)
       =========================== */

    // Nominee Name
    if (!nomineeName.trim()) {
      setNameError('Nominee Name is required.');
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nomineeName.trim())) {
      setNameError('Name should contain only alphabets.');
      valid = false;
    }

    // Nominee Relation
    if (!nomineeRelation.trim()) {
      setRelationError('Nominee Relation is required.');
      valid = false;
    }

    // Nominee DOB
    if (!nomineeDob) {
      setDobError('Nominee DOB is required.');
      valid = false;
    }

    if (!valid) return;

    /* ===========================
       Age-based validation
       =========================== */

    const nomineeAge = calculateAge(nomineeDob);

    // 🔞 Adult nominee → ALL mandatory
    if (nomineeAge >= 18) {

      // PAN (mandatory)
      if (!nomineeId.trim()) {
        setPanError('PAN number is required.');
        valid = false;
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(nomineeId.trim())) {
        setPanError('Please enter a valid PAN number.');
        valid = false;
      }

      // Email (mandatory)
      if (!nomineeEmail.trim()) {
        setEmailError('Email is required.');
        valid = false;
      } else if (!isValidEmail(nomineeEmail.trim())) {
        setEmailError('Please enter a valid email.');
        valid = false;
      }

      // Phone (mandatory)
      if (!nomineePhone.trim()) {
        setPhoneError('Phone number is required.');
        valid = false;
      } else if (cleanedPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit phone number.');
        valid = false;
      }
    }

    // 👶 Minor nominee → no validation



    if (!valid) return;

    setLoading(true);
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        setGeneralError('Missing authentication or client ID.');
        setLoading(false);
        return;
      }

      const kycDataStr = await AsyncStorage.getItem('kycData');
      const kycData = kycDataStr ? JSON.parse(kycDataStr) : {};

      const body = {
        ...kycData,
        clientId: Number(ClientId),
        nomineeName,
        nomineeDob: nomineeDob || null,
        nomineeRelationWithInvestor: nomineeRelation,
        nomineeId: nomineeId || null,
        nomineeEmail: nomineeEmail || null,
        nomineePhone: cleanedPhone || null,
      };



      const res = await fetch(
        `${baseURL}${endpoints.ADD_KYC_DETAILS}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (data?.status === true && data?.response?.status === true) {
        await AsyncStorage.removeItem('kycData');

        const age = calculateAge(nomineeDob);

        if (age < 18) {
          // Navigate to Guardian Details if minor
          navigation.navigate('EditGuardianDetails', {
            ...route.params,
            nomineeDob,
            nomineeName,
            nomineeRelationWithInvestor: nomineeRelation,
            nomineeId: nomineeId || null,
            nomineeEmail: nomineeEmail || null,
            nomineePhone: cleanedPhone || null,
          });
        } else {
          // Navigate to Address if adult
          navigation.navigate('EditAddresNominee', {
            nextScreen: route.params?.nextScreen,
            nomineeDob,
            pendingScreens: route.params?.pendingScreens
          });
        }
      } else {
        setGeneralError(data?.response?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setGeneralError('Something went wrong. Please try again.');
    }
  };


  return (
    <View style={[CommonStyles.container, { paddingBottom: Platform.OS === 'ios' ? responsiveHeight(12) : responsiveHeight(16) }]}>
      <CustomHeader title="Edit Nominee" showBack />
      <NomineeFirstProgress style={styles.progressbarStyle} />
      {loading ? (
        <View style={styles.centerLogo}><Loader /></View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
              <CustomTextInput
                value={nomineeName}
                onChangeText={(t) => { setNomineeName(t); setNameError(''); }}
                placeholder="Enter Nominee Name"
                title="Nominee Name"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              <CustomTextInput
                title="Nominee DOB"
                placeholder="DD/MM/YYYY"
                value={nomineeDob}
                iconName="calendar"
                onPress={toggleCalendarModal}
                isDropdown={true}
                onPressIcon={toggleCalendarModal}
              />
              {/* {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null} */}
              <CustomTextInput
                title="Nominee Relation"
                placeholder="Select Nominee Relation"
                value={nomineeRelation}
                // iconName="chevron-down"
                isDropdown={true}
                onPress={toggleRelationModal}
              />
              {relationError ? <Text style={styles.errorText}>{relationError}</Text> : null}
              <ModalDropdown
                visible={isRelationModalVisible}
                data={relations}
                onSelect={selectRelation}
                onClose={toggleRelationModal}
              />

              <CustomCalendarComponent
                isCalendarModalVisible={isCalendarModalVisible}
                closeCalendarModal={toggleCalendarModal}
                dateSelected={dateSelected}
                current={nomineeDob}
                minimumDate={new Date(1925, 0, 1)}
              />
              <CustomTextInput
                value={nomineeId}
                onChangeText={(t) => { setNomineeId(t.toUpperCase()); setPanError(''); }}
                placeholder="Enter PAN No."
                title="Nominee PAN No."
                maxLength={10}
              />
              {panError ? <Text style={styles.errorText}>{panError}</Text> : null}
              <CustomTextInput
                value={nomineeEmail}
                onChangeText={(t) => { setNomineeEmail(t); setEmailError(''); }}
                placeholder="Enter Nominee Email"
                title="Nominee Email"
                keyboardType="email-address"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              <CustomTextInput
                value={nomineePhone}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '').slice(0, 10);
                  setnomineePhone(cleaned);
                  setPhoneError('');
                }}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                title={'Phone Number'}
                maxLength={10}
              />
              {phoneError ? (
                <Text allowFontScaling={false} style={styles.errorText}>
                  {phoneError}
                </Text>
              ) : null}
              <View style={styles.btnRowss}>
                <CustomBackButton
                  title="Cancel"
                  onPress={handleGoBack}
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
    marginTop: responsiveHeight(3)
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
  label: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
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

export default EditNominee;
