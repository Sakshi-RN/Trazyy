import { useState, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Alert
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
import CustomCalendarComponent from '../../Components/CustomCalendarComponent';
import Loader from '../../Components/Loader';
import ModalDropdown from '../../Components/ModalDropdown';
import { Fonts } from '../../Themes/Fonts';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const formatDateForDisplay = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

const formatDateForPayload = (displayDate) => {
  if (!displayDate) return '';
  const [day, month, year] = displayDate.split('-');
  return `${year}-${month}-${day}`;
};

const EditOtherDetails = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const route = useRoute();
  const { maritalStatus, anniversaryDate, automobileOwned, clubMembership } = route.params;
  const [anniversary, setAnniversary] = useState(formatDateForDisplay(anniversaryDate));
  const [loading, setLoading] = useState(true);
  const [relations, setRelations] = useState([]);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isRelationModalVisible, setIsRelationModalVisible] = useState(false);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState(maritalStatus || '');
  const [automobile, setAutomobile] = useState(automobileOwned || '');
  const [club, setClub] = useState(clubMembership || '');

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const relRes = await axios.get(
        `${baseURL}${endpoints.MARITAL_STATUS}`
      );
      if (relRes.data?.response?.length) {
        setRelations(relRes.data.response.map(r => ({
          id: r.id,
          label: r.masterValueDesc,
        })));
      } else {
        setRelations([]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load marital status data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchProfile(); }, [fetchProfile]));

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const toggleRelationModal = () => setIsRelationModalVisible(!isRelationModalVisible);

  const dateSelected = (selectedDate) => {
    setAnniversary(selectedDate);
    toggleCalendarModal();
  };

  const selectRelation = (selectedRelation) => {
    setSelectedMaritalStatus(selectedRelation.label);
    toggleRelationModal();
  };

  const handleGoBack = () => navigation.goBack();

  const handleSave = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const ClientId = await AsyncStorage.getItem('clientID');

      if (!storedToken || !ClientId) {
        Alert.alert('Error', 'Missing client credentials');
        setLoading(false);
        return;
      }

      const body = {
        referredId: ClientId,
        maritalStatus: selectedMaritalStatus,
        anniversaryDate: formatDateForPayload(anniversary),
        automobileOwned: automobile,
        clubMembership: club,
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
        navigation.goBack();
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
      <CustomHeader title="Edit Other Details" showBack />
      {loading ? (
        <View style={styles.centerLogo}><Loader /></View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>

              <CustomTextInput
                placeholder="Marital Status"
                title="Marital Status"
                value={selectedMaritalStatus}
                isDropdown={true}
                onPress={toggleRelationModal}
              />

              <CustomTextInput
                title="Wedding Anniversary"
                placeholder="DD-MM-YYYY"
                value={anniversary}
                iconName="calendar"
                onPress={toggleCalendarModal}
                isDropdown={true}
                onPressIcon={toggleCalendarModal}
              />

              <CustomTextInput
                placeholder="Automobile Owned"
                title="Automobile Owned"
                value={automobile}
                onChangeText={setAutomobile}
              />

              <CustomTextInput
                placeholder="Club Membership"
                title="Club Membership"
                value={club}
                onChangeText={setClub}
              />

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
                current={anniversary}
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

export default EditOtherDetails;
