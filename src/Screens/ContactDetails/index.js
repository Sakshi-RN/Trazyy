import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
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

const ContactDetails = () => {
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
      navigation.navigate('EditContactDetails', {
        postalAddress1: profileData?.postalAddress1,
        postalAddress2: profileData?.postalAddress2,
        city: profileData?.city,
        state: profileData?.state,
        pinCode: profileData?.pincode,
        nextScreen: route.params?.nextScreen
      });
    }
  };




  const Section = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Address 1</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.postalAddress1 || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Address 2</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.postalAddress2 || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>City</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.city || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>State</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.state || 'N/A'}</Text>
        </View>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>PIN Code</Text>
        <View style={styles.textEndStyle}>
          <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.pincode || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Contact Details" showBack />
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
    marginLeft: responsiveWidth(0.5)

  },
  textEndStyle: {
    alignItems: 'flex-end',
    width: responsiveWidth(52),
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
});

export default ContactDetails;
