import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Platform, Modal } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomHeader from '../../Components/CustomHeader';
import CustomButton from '../../Components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactIcon from '../../Assets/svg/ContactIcon.svg';
import CalendarIcon from '../../Assets/svg/CalendarIcon.svg';
import BankIcon from '../../Assets/svg/BankIcon.svg';
import KYCIcon from '../../Assets/Images/KYCIcon.jpg';
import PartnershipIcon from '../../Assets/svg/Partnership.svg';
import AboutIcon from '../../Assets/Images/AboutIcon.jpg';
import FAQIcon from '../../Assets/svg/FAQIcon.svg';
import LogoutIcon from '../../Assets/svg/LogoutIcon.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../../Themes/Fonts';
import { CommonStyles } from '../../Themes/CommonStyles';
import axios from 'axios';
import Loader from '../../Components/Loader';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const Profile = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleProfileDetails = () => navigation.navigate('ProfileDetails');
  const handlePartnership = () => navigation.navigate('ReferralList');
  const handleAboutInvestek = () => navigation.navigate('AboutInvestek');
  const handleUpdateKYCDetails = () => navigation.navigate('NomineeDetails');
  const handleBankDetails = () => navigation.navigate('BankDetailsFirstForm');
  const handleContactDetails = () => navigation.navigate('ContactDetails');
  const handlOtherDetails = () => navigation.navigate('OtherDetails');
  const handleAboutPage = () => navigation.navigate('AboutUsPage');



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
  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    setLoading(true);
    try {
      const keys = ['clientID', 'userEmail', 'authToken', 'userID', 'clientsDetails', 'managerID', 'detailsCompleted'];
      await AsyncStorage.multiRemove(keys);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      Alert.alert("Error", "An error occurred while logging out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = () => {
    return (
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={CommonStyles.containerBox}>
            <Text allowFontScaling={false} style={styles.modalTitle}>Logout</Text>
            <Text allowFontScaling={false} style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <CustomBackButton title={'Cancel'}
                onPress={() => setLogoutModalVisible(false)}
              />
              <CustomButton title={'Yes'} onPress={confirmLogout} />
            </View>
          </View>
        </View>
      </Modal>

    )
  }
  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A"; // show N/A if not available

    const str = String(phone).replace(/\D/g, ""); // keep only digits
    if (str.length !== 10) return "N/A"; // invalid phone -> N/A

    return `+91 ${str.replace(/(\d{5})(\d{5})/, "$1 $2")}`;
  };


  const ProfileCardContainer = () => (
    <TouchableOpacity style={[CommonStyles.containerBox, styles.profileCard]} onPress={handleProfileDetails}>
      <View style={styles.avatar}>
        <LinearGradient
          colors={['#b9bcbfff', '#dadde1ff', '#dce5f0ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >

          <Text allowFontScaling={false} style={styles.avatarText}>
            {(profileData?.firstname?.[0] || '').toUpperCase()}{(profileData?.lastname?.[0] || '').toUpperCase()}
          </Text>
        </LinearGradient>
      </View>
      <View style={styles.userInfo}>
        <Text allowFontScaling={false} style={styles.userName}>
          {profileData?.firstname
            ? profileData.firstname.charAt(0).toUpperCase() + profileData.firstname.slice(1)
            : 'N/A'}
          {' '}
          {profileData?.lastname
            ? profileData.lastname.charAt(0).toUpperCase() + profileData.lastname.slice(1)
            : ''}
        </Text>
        <Text allowFontScaling={false} style={styles.userPhone}>
          {formatPhoneNumber(profileData?.phone)}
        </Text>
      </View>
      <Entypo name="chevron-right" size={24} color={Colors.black} />
    </TouchableOpacity>
  );

  const Section = ({ title, data }) => (
    <>
      <Text allowFontScaling={false} style={styles.sectionTitle}>{title}</Text>
      <View style={CommonStyles.containerBox}>
        {data.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.option} onPress={item.onPress}>
            <View style={styles.iconWrapper}>{item.icon}</View>
            <View style={styles.headerContent}>
              <Text allowFontScaling={false} style={styles.optionText}>{item.title}</Text>
              <Text allowFontScaling={false} style={styles.refinetext}>{item.desc}</Text>
            </View>
            <Entypo name="chevron-right" size={24} color={Colors.black} />
          </TouchableOpacity>
        ))}
      </View>
    </>
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
          <Section
            title="Details"
            data={[
              {
                title: 'Contact Details',
                desc: 'Add your address for reference.',
                icon: <ContactIcon />,
                onPress: handleContactDetails,
              },
              {
                title: 'Other Details',
                desc: 'Add your special dates to be celebrated.',
                icon: <CalendarIcon />,
                onPress: handlOtherDetails,
              },
              {
                title: 'Bank Details',
                desc: 'Add your bank account to make payments.',
                icon: <BankIcon />,
                onPress: handleBankDetails,
              },
              {
                title: 'KYC Update',
                desc: 'Secure your future—update your KYC today!',
                icon: <Image source={KYCIcon} />,
                onPress: handleUpdateKYCDetails,
              },
              // {
              //   title: 'Partnership',
              //   desc: 'Expand your horizons with collaborations.',
              //   icon: <PartnershipIcon />,
              //   onPress: handlePartnership,
              // },
            ]}
          />

          <Section
            title="Others"
            data={[
              {
                title: 'About InvesTek',
                desc: 'Privacy policy, Terms & About InvesTek',
                icon: <Image source={AboutIcon} />,
                onPress: handleAboutPage,
              },
              // {
              //   title: 'FAQ',
              //   desc: 'Clear all your questions.',
              //   icon: <FAQIcon />,

              // },
            ]}
          />
          <TouchableOpacity style={[CommonStyles.containerBox, styles.logoutBtn]} onPress={() => setLogoutModalVisible(true)}>
            <LogoutIcon />
            <Text allowFontScaling={false} style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          {modalContent()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? responsiveHeight(13) : responsiveHeight(16),
    paddingHorizontal: responsiveWidth(5),
  },

  avatar: {
    backgroundColor: Colors.lightBlue,
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
  userInfo: {
    marginLeft: responsiveWidth(4),
    flex: 1,
  },
  userName: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,
  },
  userPhone: {
    fontSize: responsiveFontSize(1.7),
    color: Colors.blue,
    fontFamily: Fonts.Medium600,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: Fonts.Bold800,
    color: Colors.black,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1),
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3)
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
    backgroundColor: '#F2FDFF',
    paddingVertical: responsiveHeight(2)

  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
  },
  iconWrapper: {
    marginRight: responsiveWidth(3),
  },
  headerContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
  },
  refinetext: {
    fontSize: 12,
    color: Colors.darkGrey,
    fontFamily: Fonts.Medium600,
  },

  logoutText: {
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(1.8),
    color: Colors.red,
    fontFamily: Fonts.Bold800,

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: responsiveWidth(80),
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: responsiveWidth(5),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.Bold800,
    color: Colors.red,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: responsiveHeight(2),
  },
  modalMessage: {
    fontSize: 17,
    fontFamily: Fonts.Semibold700,
    color: Colors.black,
    marginTop: responsiveHeight(2),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(3),
    alignItems: 'center'
  },
  cancelBtn: {
    marginHorizontal: responsiveWidth(3),
    borderWidth: 1.5,
    borderColor: Colors.red,
    backgroundColor: Colors.white,
    paddingHorizontal: responsiveWidth(8),
  },
  cancelText: {
    color: Colors.red,
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default Profile;
