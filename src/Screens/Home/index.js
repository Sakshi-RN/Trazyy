import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';
import Colors from '../../Themes/Colors';
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

const Home = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState(null);


  const [userPhone, setUserPhone] = useState(null);

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
            <TouchableOpacity >
              <InvestorBtn />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExistingInvestor}>
              <ExistingInvestor />
            </TouchableOpacity>
          </View>
          <View style={styles.rowStyle}>
            <TouchableOpacity >
              <BondsBtn />
            </TouchableOpacity>
            <TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({

  scrollContent: {
    flex: 1,
    paddingBottom: responsiveHeight(13)
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
    marginTop: responsiveHeight(7),

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
  }
});

export default Home;

