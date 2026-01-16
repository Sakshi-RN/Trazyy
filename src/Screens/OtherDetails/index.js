import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../utils/config';

const OtherDetails = () => {
  const navigation = useNavigation();
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
        `${baseURL}${endpoints.GET_REFERRAL_BY_ID}${ClientId}`
      );
      setProfileData(res.data);
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
      navigation.navigate('EditOtherDetails', {
        maritalStatus: profileData?.maritalStatus,
        anniversaryDate: profileData?.anniversaryDate,
        automobileOwned: profileData?.automobileOwned,
        clubMembership: profileData?.clubMembership
      });
  };
  const formatDate = (anniversaryDate) => {
    const date = new Date(anniversaryDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const Section = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Marital Status</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.maritalStatus || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Wedding Anniversary</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>
            {profileData?.anniversaryDate
              ? formatDate(profileData.anniversaryDate)
              : 'N/A'}
          </Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Automobile Owned</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.automobileOwned || 'N/A'}</Text>
        </View>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Club Membership</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.clubMembership || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Other Details" showBack />
      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : (
        <View style={styles.scrollContent}>
          <Section />
          <CustomButton
            title={'Edit'}
            buttonStyle={styles.button}
            onPress={handleEdit}
          />
        </View>
      )}
    </View>
  );

};



const styles = StyleSheet.create({

  scrollContent: {
    paddingTop: responsiveHeight(2),
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
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,
    textAlign: 'center',
    marginLeft: responsiveWidth(0.5)

  },
  button: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEndStyle: {
    alignItems: 'flex-end',
    width: responsiveWidth(45),

  },
});

export default OtherDetails;
