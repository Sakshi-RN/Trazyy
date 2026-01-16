import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import getEnvVars from '../../utils/config';


const NomineeDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchProfile = async () => {
    try {
      const ClientId = await AsyncStorage.getItem('clientID');

      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        return;
      }

      const res = await axios.get(
        `${baseURL}${endpoints.GET_KYC_DETAILS}${ClientId}`
      );

      if (res.data?.response?.status) {
        setProfileData(res.data.response.kycDetails);
      } else {
        Alert.alert('Info', res.data?.response?.message || 'No nominee details found');
        setProfileData(null);
      }
    } catch (err) {

      if (err.response?.data?.error) {
        Alert.alert('Error', err.response.data.error);
      } else {
        Alert.alert('Error', 'Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleEdit = () => {
    if (profileData) {
      navigation.navigate('EditKyc', { nextScreen: route.params?.nextScreen });
    }
  };


  const KYCSection = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Name as per PAN</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nameAsPerPan || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>PAN Number</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {profileData?.panNumber || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Date of birth</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.dobOfInvestor || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Place of birth</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.placeOfBirth || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Occupation</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.occupation || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Income Range</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.investorsIncomeRange || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Source of Income</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.sourceOfIncome || 'N/A'}</Text>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Politically Exposed Person</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.pepDetails || 'N/A'}</Text>
      </View>
    </View>
  );

  const calculateAgeFromDob = (dob) => {
    if (!dob) return 0;
    let day, month, year;
    if (dob.includes('/')) {
      [day, month, year] = dob.split('/');
    } else if (dob.includes('-')) {
      [day, month, year] = dob.split('-');
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

  const GuardianSection = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian Name</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianName || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian PAN</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianPan || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian Email</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianEmail || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian Phone</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianPhone || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian Address</Text>
        <View style={{ alignItems: 'flex-end', width: responsiveWidth(45) }}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianAddress || 'N/A'}</Text>
        </View>
      </View>
      {/* <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian City</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianCity || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian State</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianState || 'N/A'}</Text>
      </View> */}
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Guardian Pincode</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.guardianPincode || 'N/A'}</Text>
      </View>
    </View>
  );

  const NomineeSection = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Name</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeName || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee DOB</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {profileData?.nomineeDob || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Relation</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeRelationWithInvestor || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee PAN No.</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeId || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Email</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeEmail || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Phone</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineePhone || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Address</Text>
        <View style={{ alignItems: 'flex-end', width: responsiveWidth(45) }}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeAddress || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee City</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeCity || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee State</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineeState || 'N/A'}</Text>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Nominee Pincode</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.nomineePincode || 'N/A'}</Text>
      </View>
    </View>
  );
  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(5) }]}>
      <CustomHeader title="KYC Details" showBack />
      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={[styles.headingText, { marginTop: 0 }]}>KYC Details</Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          <KYCSection />
          <Text allowFontScaling={false} style={styles.headingText}>Nominee Details</Text>
          <NomineeSection />
          {profileData?.nomineeDob && calculateAgeFromDob(profileData.nomineeDob) < 18 ? (
            <>
              <Text allowFontScaling={false} style={styles.headingText}>Guardian Details</Text>
              <GuardianSection />
            </>
          ) : null}
          <CustomButton
            title={'Edit'}
            buttonStyle={styles.button}
            onPress={handleEdit}
          />
        </ScrollView>
      )}
    </View>
  );

};



const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: responsiveHeight(13),
    paddingHorizontal: responsiveWidth(5),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.3),
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1.5
  },
  optionText: {
    fontSize: 14,
    color: Colors.blue,
    fontFamily: Fonts.Medium600,
  },
  refinetext: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.Semibold700
  },
  button: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingText: {
    fontSize: 18,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(2)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2)
  }
});

export default NomineeDetails;
