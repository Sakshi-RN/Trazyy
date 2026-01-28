import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image, Platform, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Colors from '../../Themes/Colors';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { LoanBtn, InsuranceBtn, Logo, Money, InvestorBtn, ExistingInvestor, BondsBtn, CalculatorImg, HiAiImg } from '../../Assets/svg';
import { CommonStyles } from '../../Themes/CommonStyles';
import images from '../../Themes/Images';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import WebViewContainer from '../../Components/WebViewContainer';
import getEnvVars from '../../utils/config';
import ReusableEnquiryModal from '../../Components/ReusableEnquiryModal';

const Home = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState(null);
  const [asperoLoading, setAsperoLoading] = useState(false);
  const [userPhone, setUserPhone] = useState(null);


  // Enquiry Modal State
  const [investorVisible, setInvestorVisible] = useState(false);
  const [insuranceVisible, setInsuranceVisible] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const getGreetingData = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { background: images.MrngBg };
    } else if (hour >= 12 && hour < 17) {
      return { background: images.NoonBg };
    } else if (hour >= 17 && hour < 20) {
      return { background: images.EvngBg };
    } else {
      return { background: images.NightBg };
    }
  };

  const { background } = getGreetingData();

  const handleInvestorPress = () => {
    setInvestorVisible(true);
  };

  const handleInsurancePress = () => {
    setInsuranceVisible(true);
  };

  const submitEnquiry = async (message, source) => {
    try {
      setEnquiryLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');

      if (!clientId) {
        Alert.alert("Error", "User not logged in correctly.");
        setEnquiryLoading(false);
        return;
      }

      const payload = {
        client_id: Number(clientId),
        query_message: message,
        utm_source: source,
        status: "NEW",
        isActive: 1
      };

      const response = await axios.post(
        `${baseURL}${endpoints.ADD_ENQUIRY}`,
        payload
      );

      setEnquiryLoading(false);

      if (response.data?.status && (response.data?.statusCode === "0" || response.data?.statusCode === 0)) {
        Alert.alert("Success", response.data?.response?.message || "Enquiry Added");
        console.log("Enquiry API Response:", response.data?.response);

        // Close modals
        setInvestorVisible(false);
        setInsuranceVisible(false);
      } else {
        Alert.alert("Error", response.data?.response?.message || "Something went wrong.");
      }

    } catch (error) {
      setEnquiryLoading(false);
      console.error("Enquiry API Error:", error);
      Alert.alert("Error", "Failed to submit enquiry. Please try again.");
    }
  };

  const renderHeader = () => {

    return (
      <ImageBackground source={background} imageStyle={{ borderRadius: 18 }}>
        <WebViewContainer />
        <Text allowFontScaling={false} style={styles.prflNameText}>Welcome M/s Chennai Super Kings Pvt Ltd,</Text>
        {thoughts?.thought && (
          <Text allowFontScaling={false} style={styles.quoteText}>
            “{thoughts.thought}”
          </Text>
        )}

        {thoughts?.writer && (
          <Text allowFontScaling={false} style={styles.autorText}>
            — {thoughts.writer}
          </Text>
        )}
        <TouchableOpacity style={styles.balanceBtn}>
          <Text allowFontScaling={false} style={styles.balanceBtnText}>Check your Balance</Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  }


  const fetchDashboardPortfolio = async () => {
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      const clientDetailsString = await AsyncStorage.getItem('clientsDetails');

      if (clientDetailsString) {
        try {
          const clientDetails = JSON.parse(clientDetailsString);
          if (clientDetails?.phone) {
            setUserPhone(clientDetails.phone);
          }
        } catch (e) {
          console.log('Error parsing client details', e);
        }
      }

      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        return;
      }

      const response = await axios.get(
        `${baseURL}${endpoints.DASHBOARD}${ClientId}`
      );

      if (response.data?.response?.status) {
        const res = response.data.response;

        setThoughts(res.data?.thoughts || null);
      }

    } catch (error) {
      console.error('API error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardPortfolio();
    }, [])
  );

  const handleBondsPress = async () => {
    try {
      setAsperoLoading(true);

      const clientId = await AsyncStorage.getItem('clientID');

      if (!clientId) {
        console.warn('Client ID not found');
        return;
      }

      const response = await axios.get(
        `https://apidev.investek.in/asperoEngine/asperoLogin/${clientId}`
      );

      const apiResponse = response?.data?.response;

      if (apiResponse?.status) {
        const redirectUrl = apiResponse?.data?.redirectUrl;

        if (redirectUrl) {
          navigation.navigate('AsperoWebView', {
            url: redirectUrl,
          });
        }
      } else {
        console.warn(apiResponse?.message || 'Aspero login failed');
      }
    } catch (error) {
      console.error('Aspero API error:', error.message);
    } finally {
      setAsperoLoading(false);
    }
  };




  if (loading) {
    return (
      <View style={styles.centerLogo}>
        <Loader />
      </View>

    );
  }

  const handleExistingInvestor = () => {
    navigation.navigate('MutualFund');
  };

  return (
    <View style={CommonStyles.container}>
      <Logo style={styles.centerContainer} />
      <ImageBackground source={images.BGImg} style={styles.scrollContent}>
        {renderHeader()}
        <ScrollView
          style={styles.paddingScrollContent} >
          <Money style={styles.moneyImgStyle} />
          <View style={styles.rowStyle}>
            <TouchableOpacity onPress={handleInvestorPress}>
              <InvestorBtn />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExistingInvestor}>
              <ExistingInvestor />
            </TouchableOpacity>
          </View>
          <View style={styles.rowStyle}>
            <TouchableOpacity onPress={handleBondsPress}>
              <BondsBtn />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInsurancePress}>
              <InsuranceBtn />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.moneyImgStyle} onPress={() => navigation.navigate('LarkWebView', {
            phoneNumber: userPhone || '9999999999',
          })}>
            <LoanBtn />
          </TouchableOpacity>
          <View style={styles.rowStyle}>
            <TouchableOpacity >
              <ImageBackground source={images.CalculatorBox} style={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2), }}>
                <View style={styles.iconsRow}>
                  <CalculatorImg />
                  <Text allowFontScaling={false} style={styles.CalculatorText}>FPS Calculator</Text>
                </View>
                <Text allowFontScaling={false} style={styles.smallText}>Explore the world of imagination.</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('HiAiSays')}>
              <ImageBackground source={images.CalculatorBox} style={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2) }}>
                <View style={styles.iconsRow}>
                  <HiAiImg />
                  <Text allowFontScaling={false} style={styles.CalculatorText}>HiAi SAYS</Text>
                </View>
                <Text allowFontScaling={false} style={styles.smallText}>Your one stop solution for market insights.</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('TrazyyUniversity')}>
            <Image source={images.TrazzyWorldBox} style={styles.moneyImgStyle} />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
      <ReusableEnquiryModal
        visible={investorVisible}
        onClose={() => setInvestorVisible(false)}
        onSubmit={(msg) => submitEnquiry(msg, 'FirstTimeInvester')}
        loading={enquiryLoading}
        title="First Time Investor"
      />
      <ReusableEnquiryModal
        visible={insuranceVisible}
        onClose={() => setInsuranceVisible(false)}
        onSubmit={(msg) => submitEnquiry(msg, 'Insurance')}
        loading={enquiryLoading}
        title="Insurance"
      />
    </View>
  );
};

const styles = StyleSheet.create({

  scrollContent: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? responsiveHeight(13) : responsiveHeight(16)
  },
  paddingScrollContent: {
    paddingHorizontal: responsiveWidth(5),

  },
  moneyImgStyle: {
    marginTop: responsiveHeight(2),
    alignSelf: 'center'
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2.5)
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerContainer: {
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? responsiveHeight(7) : responsiveHeight(5),

  },
  prflNameText: {
    fontSize: 20,
    marginTop: responsiveHeight(1.5),
    fontFamily: Fonts.Semibold700,
    color: Colors.white,
    marginLeft: responsiveWidth(7),
    width: responsiveWidth(80),

  },
  quoteText: {
    fontSize: 13,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700,
    color: Colors.white,
    marginLeft: responsiveWidth(7),
    width: responsiveWidth(85),

  },
  autorText: {
    fontSize: 13,
    marginTop: responsiveHeight(0.3),
    fontFamily: Fonts.Semibold700,
    color: Colors.white,
    marginRight: responsiveWidth(15),
    alignSelf: 'flex-end',
    marginBottom: responsiveHeight(1)
  },
  balanceBtn: {
    backgroundColor: Colors.greenBtn,
    paddingHorizontal: responsiveHeight(1.5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(2),
    alignSelf: 'center',
    bottom: responsiveHeight(-1),
  },
  balanceBtnText: {
    fontSize: 12,
    fontFamily: Fonts.Semibold700,
    color: Colors.white
  },
  CalculatorText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.black,
    marginLeft: responsiveWidth(2),
    width: responsiveWidth(22)
  },
  smallText: {
    fontSize: 11,
    fontFamily: Fonts.Medium600,
    color: Colors.blue,
    width: responsiveWidth(30),
    marginTop: responsiveHeight(0.5)
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: responsiveWidth(5),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.Bold800,
    color: Colors.blue,
  },
  closeText: {
    fontSize: 20,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
  },
  modalLabel: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.black,
    marginBottom: responsiveHeight(1),
  },
  textArea: {
    height: responsiveHeight(18),
    marginBottom: responsiveHeight(2),
    borderRadius: 10,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,
    alignItems: 'flex-start',
  },
  wordCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Medium600,
    marginTop: -responsiveHeight(1),
  },
  submitBtn: {
    marginTop: responsiveHeight(2),
    alignSelf: 'center'
  }
});

export default Home;

