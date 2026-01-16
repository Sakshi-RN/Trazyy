import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  View, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Alert, Text, BackHandler
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import CustomBackButton from '../../Components/CustomBackButton';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import CustomCalendarComponent from '../../Components/CustomCalendarComponent';
import Loader from '../../Components/Loader';
import ModalDropdown from '../../Components/ModalDropdown';
import styles from './styles';
import getEnvVars from '../../utils/config';

const formatDateForDisplay = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

const formatDateForPayload = (displayDate) => {
  if (!displayDate) return '';
  const [day, month, year] = displayDate.split('-');
  return `${year}-${month}-${day}`;
};


const EditProfile = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { firstname, lastname, email, phone, dob, getgender } = route.params;

  const [firstName, setFirstName] = useState(firstname || '');
  const [lastName, setLastName] = useState(lastname || '');
  const [userEmail, setUserEmail] = useState(email || '');
  const [dateOfBirth, setDateOfBirth] = useState(formatDateForDisplay(dob));
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [userPhone, setUserPhone] = useState(String(phone || ''));
  const [gender, setGender] = useState(getgender || '');
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const fetchProfile = useCallback(async () => {
    if (firstname && lastname && email && phone && dob && getgender) return; // Data already passed via params

    try {
      setLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) return;

      const res = await axios.get(
        `${baseURL}${endpoints.GET_REFERRAL_BY_ID}${ClientId}`
      );

      const data = res.data;
      if (data) {
        setFirstName(data.firstname || '');
        setLastName(data.lastname || '');
        setUserEmail(data.email || '');
        setUserPhone(String(data.phone || ''));
        if (data.dob) setDateOfBirth(formatDateForDisplay(data.dob));
        if (data.gender) setGender(data.gender);
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [firstname, lastname, email, phone, dob, getgender, baseURL, endpoints]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };


  const dateSelected = (selectedDate) => {
    setDateOfBirth(selectedDate);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const genderList = [
    { id: '1', label: 'Male' },
    { id: '2', label: 'Female' },
    { id: '3', label: 'Other' },
  ];

  const toggleGenderModal = () => {
    setIsGenderModalVisible(!isGenderModalVisible);
  };

  const selectGender = (selectedGender) => {
    setGender(selectedGender.label);
    toggleGenderModal();
  };

  // useEffect(() => {
  //   const pendingScreens = route.params?.pendingScreens;
  //   if (pendingScreens && pendingScreens.length >= 0) {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
  //     return () => backHandler.remove();
  //   }
  // }, [route.params?.pendingScreens]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      setFirstNameError('Please enter your first name.');
      return;
    }

    if (!lastName.trim()) {
      setLastNameError('Please enter your last name.');
      return;
    }

    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('authToken');

      if (!storedToken) {
        Alert.alert('Error', 'No token found.');
        setLoading(false);
        return;
      }

      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage.');
        setLoading(false);
        return;
      }
      const payloadDob = formatDateForPayload(dateOfBirth);

      const body = {
        referredId: ClientId,
        firstname: firstName,
        lastname: lastName,
        dob: payloadDob,
        gender: gender,
      };

      const res = await fetch(
        `${baseURL}${endpoints.UPDATE_REFERRAL}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': storedToken,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (data?.response?.status === true) {
        const pendingScreens = route.params?.pendingScreens;
        if (pendingScreens && pendingScreens.length > 0) {
          const next = pendingScreens[0];
          const remaining = pendingScreens.slice(1);
          navigation.navigate(next, { pendingScreens: remaining, nextScreen: remaining[0] });
        } else if (route.params?.nextScreen) {
          navigation.navigate(route.params.nextScreen);
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert('Error', data?.response?.message || 'Update failed');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
      <CustomHeader title="Edit Profile" showBack={true} />
      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <CustomTextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  title={'First Name'}
                />
                {firstNameError ? (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    {firstNameError}
                  </Text>
                ) : null}
                <CustomTextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  title={'Last Name'}
                />
                {lastNameError ? (
                  <Text allowFontScaling={false} style={styles.errorText}>
                    {lastNameError}
                  </Text>
                ) : null}

                <CustomTextInput
                  title="Gender"
                  placeholder="Select Gender"
                  value={gender}
                  onPress={toggleGenderModal}
                  // iconName="chevron-down"
                  isDropdown={true}
                />
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
                  minimumDate={new Date(1925, 0, 1)}
                />
                <CustomTextInput
                  value={userEmail}
                  editable={false}
                  placeholder="Email address"
                  inputBox={styles.disableEmailTextColor}
                  title={'Email address'}
                />
                <CustomTextInput
                  value={userPhone}
                  // onChangeText={(text) => {
                  //   const cleaned = text.replace(/\D/g, '').slice(0, 10);
                  //   setUserPhone(cleaned);
                  //   setPhoneError('');
                  // }}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  title={'Phone Number'}
                  inputBox={styles.disableEmailTextColor}
                  editable={false}
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
                    title="Save"
                    onPress={handleSave}
                  />
                </View>
                <ModalDropdown
                  visible={isGenderModalVisible}
                  data={genderList}
                  onSelect={selectGender}
                  onClose={toggleGenderModal}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};


export default EditProfile;
