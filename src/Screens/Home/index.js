import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import Colors from '../../Themes/Colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { LoanBtn, InsuranceBtn, Logo, Money, InvestorBtn, ExistingInvestor, BondsBtn, CalculatorImg, HiAiImg, TrazzyImg } from '../../Assets/svg';
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
        setPortfolioData(res);
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
            <TouchableOpacity >
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
            phoneNumber: '9999999999',
          })}>
            <LoanBtn />
          </TouchableOpacity>
          <View style={styles.rowStyle}>
            <TouchableOpacity >
              <ImageBackground source={images.CalculatorBox}>
                <CalculatorImg />
                <Text allowFontScaling={false} style={styles.balanceBtnText}>FPS Calculator</Text>
                <Text allowFontScaling={false} style={styles.balanceBtnText}>Explore the world of imagination.</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageBackground source={images.CalculatorBox}>
                <HiAiImg />
                <Text allowFontScaling={false} style={styles.balanceBtnText}>HiAi SAYS</Text>
                <Text allowFontScaling={false} style={styles.balanceBtnText}>Your one stop solution for market insights.</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.moneyImgStyle}>
            <ImageBackground source={images.TrazzyWorldBox}>
              <TrazzyImg />
              <Text allowFontScaling={false} style={styles.balanceBtnText}>Trazyy World</Text>
              <Text allowFontScaling={false} style={styles.balanceBtnText}>Treasury knowledge base.</Text>
            </ImageBackground>
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
    marginTop: responsiveHeight(3),
    alignSelf: 'center'
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2)
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
    marginTop: responsiveHeight(2.5),
    fontFamily: Fonts.Semibold700,
    color: Colors.white,
    marginLeft: responsiveWidth(7),
    width: responsiveWidth(80),

  },
  quoteText: {
    fontSize: 14,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700,
    color: Colors.white,
    marginLeft: responsiveWidth(7),
    width: responsiveWidth(85),

  },
  autorText: {
    fontSize: 14,
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
});

export default Home;

