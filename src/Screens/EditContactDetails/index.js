import { useState, useCallback, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Alert, Text, BackHandler
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
import ModalDropdown from '../../Components/ModalDropdown';
import { Fonts } from '../../Themes/Fonts';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const EditContactDetails = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { postalAddress1, postalAddress2, city, state, pinCode } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [addr1, setAddr1] = useState(postalAddress1 || '');
  const [addr2, setAddr2] = useState(postalAddress2 || '');
  const [cityName, setCityName] = useState(city || '');
  const [pin, setPin] = useState(pinCode || '');
  const [selectedState, setSelectedState] = useState(state || '');
  const [pincodeError, setPincodeError] = useState('');
  const [stateList, setStateList] = useState([]);
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [addr1Error, setAddr1Error] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');


  const fetchStates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}${endpoints.GET_STATE}`
      );
      if (res.data?.response?.length) {
        setStateList(
          res.data.response.map(r => ({
            id: r.id,
            label: r.statename,
          }))
        );
      } else {
        setStateList([]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load states');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchKycDetails = useCallback(async () => {
    if (postalAddress1 || postalAddress2 || city || state || pinCode) return;

    try {
      setLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) return;

      const res = await axios.get(
        `${baseURL}${endpoints.GET_KYC_DETAILS}${ClientId}`
      );

      if (res.data?.response?.status) {
        const kycData = res.data.response.kycDetails;
        if (kycData) {
          setAddr1(kycData.postalAddress1 || '');
          setAddr2(kycData.postalAddress2 || '');
          setCityName(kycData.city || '');
          setSelectedState(kycData.state || '');
          setPin(kycData.pincode ? String(kycData.pincode) : '');
        }
      }
    } catch (err) {
      console.error('Error fetching KYC details:', err);
    } finally {
      setLoading(false);
    }
  }, [postalAddress1, postalAddress2, city, state, pinCode]);

  useFocusEffect(useCallback(() => {
    fetchStates();
    fetchKycDetails();
  }, [fetchStates, fetchKycDetails]));

  const toggleStateModal = () => {
    setIsStateModalVisible(!isStateModalVisible);
  };

  const selectState = (selected) => {
    setSelectedState(selected.label);
    toggleStateModal();
  };

  const handleGoBack = () => navigation.goBack();

  // useEffect(() => {
  //   const pendingScreens = route.params?.pendingScreens;
  //   if (pendingScreens && pendingScreens.length >= 0) {
  //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
  //     return () => backHandler.remove();
  //   }
  // }, [route.params?.pendingScreens]);

  const handleSave = async () => {
    let valid = true;

    // Reset errors
    setAddr1Error('');
    setCityError('');
    setStateError('');
    setPincodeError('');

    // Validate Address 1
    if (!addr1.trim()) {
      setAddr1Error('Address 1 is required.');
      valid = false;
    }

    // Validate City
    if (!cityName.trim()) {
      setCityError('City is required.');
      valid = false;
    }

    // Validate State
    if (!selectedState) {
      setStateError('State is required.');
      valid = false;
    }

    if (!pin.trim()) {
      setPincodeError('PIN Code is required.');
      valid = false;
    } else if (pin.length !== 6) {
      setPincodeError('Please enter a valid 6-digit PIN Code.');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        Alert.alert('Error', 'No client ID found in AsyncStorage.');
        setLoading(false);
        return;
      }

      const body = {
        clientId: ClientId,
        postalAddress1: addr1,
        postalAddress2: addr2,
        city: cityName,
        pincode: pin,
        state: selectedState,
      };

      const res = await fetch(
        `${baseURL}${endpoints.ADD_KYC_DETAILS}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          navigation.navigate('Home'); // End of flow usually goes to Home
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
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(13) }]}>
      <CustomHeader title="Edit Contact Details" showBack={true} />
      {loading ? (
        <View style={styles.centerLogo}><Loader /></View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}
            >
              <CustomTextInput
                placeholder="Enter Address 1"
                title="Address 1"
                value={addr1}
                onChangeText={setAddr1}
              />
              {addr1Error ? <Text style={styles.errorText}>{addr1Error}</Text> : null}
              <CustomTextInput
                title="Address 2"
                placeholder="Enter Address 2"
                value={addr2}
                onChangeText={setAddr2}
              />
              <CustomTextInput
                placeholder="Enter City"
                title="City"
                value={cityName}
                onChangeText={setCityName}
              />
              {cityError ? <Text style={styles.errorText}>{cityError}</Text> : null}
              <CustomTextInput
                title="State"
                placeholder="Select State"
                value={selectedState}
                // iconName="chevron-down"
                isDropdown={true}
                onPress={toggleStateModal}
              />
              {stateError ? <Text style={styles.errorText}>{stateError}</Text> : null}
              <CustomTextInput
                placeholder="Enter PIN Code"
                title="PIN Code"
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                maxLength={6}
              />
              {pincodeError ? <Text style={styles.errorText}>{pincodeError}</Text> : null}
              <ModalDropdown
                visible={isStateModalVisible}
                data={stateList}
                onSelect={selectState}
                onClose={toggleStateModal}
              />
              <View style={styles.btnRowss}>
                <CustomBackButton
                  title="Cancel"
                  onPress={handleGoBack}
                />
                <CustomButton
                  buttonStyle={styles.submitbtn}
                  textStyle={styles.submtText}
                  title="Save"
                  onPress={handleSave}
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
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
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
});

export default EditContactDetails;
