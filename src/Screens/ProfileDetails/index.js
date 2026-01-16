import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../../utils/config';

const Profile = () => {
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
    navigation.navigate('EditProfile', {
      firstname: profileData?.firstname,
      lastname: profileData?.lastname,
      email: profileData?.email,
      phone: profileData?.phone,
      dob: profileData?.dob,
      getgender: profileData?.gender,
      nextScreen: route.params?.nextScreen
    });
  };


  const ProfileCardContainer = () => (
    <TouchableOpacity style={[styles.cardContainer, styles.profileCard]}>
      <View style={styles.avatar}>
        <LinearGradient
          colors={['#b9bcbfff', '#dadde1ff', '#dce5f0ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text allowFontScaling={false} style={styles.avatarText}>
            {(profileData?.firstname?.[0] || 'N/A').toUpperCase()}{(profileData?.lastname?.[0] || '').toUpperCase()}
          </Text>
        </LinearGradient>
      </View>
      <Text allowFontScaling={false} style={styles.userName}>
        {profileData?.firstname
          ? profileData.firstname.charAt(0).toUpperCase() + profileData.firstname.slice(1)
          : ''}
        {' '}
        {profileData?.lastname
          ? profileData.lastname.charAt(0).toUpperCase() + profileData.lastname.slice(1)
          : 'N/A'}
      </Text>
    </TouchableOpacity>
  );
  const formatDate = (dob) => {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A";

    const str = String(phone).replace(/\D/g, "");
    if (str.length !== 10) return "N/A";

    return `+91 ${str.replace(/(\d{5})(\d{5})/, "$1 $2")}`;
  };


  const Section = () => (
    <View style={CommonStyles.containerBox}>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>First Name</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {profileData?.firstname
            ? profileData.firstname.charAt(0).toUpperCase() + profileData.firstname.slice(1)
            : 'N/A'}
        </Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Last Name</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {profileData?.lastname
            ? profileData.lastname.charAt(0).toUpperCase() + profileData.lastname.slice(1)
            : 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Gender</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.gender || 'N/A'}</Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Date of Birth</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>
          {profileData?.dob
            ? formatDate(profileData.dob)
            : 'N/A'}
        </Text>
      </View>
      <View style={styles.option}>
        <Text allowFontScaling={false} style={styles.optionText}>Phone</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{formatPhoneNumber(profileData?.phone)}</Text>
      </View>
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Text allowFontScaling={false} style={styles.optionText}>Email</Text>
        <Text allowFontScaling={false} style={styles.refinetext}>{profileData?.email || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Profile" showBack />
      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ProfileCardContainer />
          <Section />
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,

  },
  scrollContent: {
    paddingBottom: responsiveHeight(13),
    paddingHorizontal: responsiveWidth(5),
  },

  avatar: {
    backgroundColor: Colors.lightblue,
    borderRadius: 50,
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    fontSize: 16,
  },

  userName: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,
    width: responsiveWidth(65),
    marginLeft: responsiveWidth(3)
  },


  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(1),
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 15,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveHeight(3),
    backgroundColor: '#F2FDFF',
    paddingVertical: responsiveHeight(1.5),
    marginBottom: responsiveHeight(2)

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
    fontFamily: Fonts.Semibold700,
  },

  button: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
