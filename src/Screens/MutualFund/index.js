import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';
import Colors from '../../Themes/Colors';
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { Logo, CreateFundCard, InvestFundCard, OrderCard, RecommendationsCard } from '../../Assets/svg';
import { CommonStyles } from '../../Themes/CommonStyles';
import images from '../../Themes/Images';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import WebViewContainer from '../../Components/WebViewContainer';
import getEnvVars from '../../utils/config';
import { formatCurrency } from '../../utils/formatCurrency';

const MutualFund = () => {
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);


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

      } else {
        setPortfolioData(null);

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

  const BlueBoxContainer = () => {
    const currentCost = portfolioData?.data?.returns?.data?.rows?.[0]?.[1] || 0;
    const currentValue = portfolioData?.data?.returns?.data?.rows?.[0]?.[2] || 0;
    const absoluteReturn = portfolioData?.data?.returns?.data?.rows?.[0]?.[4] || 0;
    const xiir = portfolioData?.data?.returns?.data?.rows?.[0]?.[6] || 0;

    return (
      <ImageBackground source={images.MutualFundCardBg} style={styles.balanceBtn}>
        <Text allowFontScaling={false} style={styles.subheading}>Investment Snapshot</Text>
        <View style={styles.newRow}>
          <Text allowFontScaling={false} style={styles.nameText}>Current Cost</Text>
          <Text allowFontScaling={false} style={styles.nameText}>
            {formatCurrency(currentCost)}
          </Text>
        </View>
        <View style={styles.newRow}>
          <Text allowFontScaling={false} style={styles.nameText}>Current Value</Text>
          <Text allowFontScaling={false} style={styles.nameText}>
            {formatCurrency(currentValue)}
          </Text>
        </View>
        <View style={styles.newRow}>         
             <Text allowFontScaling={false} style={styles.nameText}>Returns %</Text>
                   <Text allowFontScaling={false} style={[styles.nameText,{color:Colors.lightGrren}]}>
            ▲ {absoluteReturn}%
          </Text>
        </View>
        <View style={styles.newRow}>
          <Text allowFontScaling={false} style={styles.nameText}>XIRR</Text>
          <Text allowFontScaling={false} style={[styles.nameText,{color:Colors.lightGrren}]}>
            ▲ {xiir}%
          </Text>
        </View>

      </ImageBackground>
    )
  }

  const renderMiddleware = () => {
    return (
      <View>
        <View style={styles.rowStyle}>
          <TouchableOpacity >
            <ImageBackground source={images.MutualFundCardBg} style={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(4), alignItems: 'center' }}>
              <CreateFundCard width={responsiveWidth(16)} height={responsiveWidth(16)} />
              <Text allowFontScaling={false} style={styles.CalculatorText}>Create Emergency Fund</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity >
            <ImageBackground source={images.MutualFundCardBg} style={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(4), alignItems: 'center' }}>
              <InvestFundCard width={responsiveWidth(16)} height={responsiveWidth(16)} />
              <Text allowFontScaling={false} style={styles.CalculatorText}>Invest Idle Funds</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.rowStyle}>
          <TouchableOpacity >
            <ImageBackground source={images.OrderCardBg} style={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(4), alignItems: 'center' }}>
              <OrderCard width={responsiveWidth(16)} height={responsiveWidth(16)} />
              <Text allowFontScaling={false} style={styles.CalculatorText}>Orders</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity >
            <ImageBackground source={images.OrderCardBg} style={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(4), alignItems: 'center' }}>
              <RecommendationsCard width={responsiveWidth(16)} height={responsiveWidth(16)} />
              <Text allowFontScaling={false} style={styles.CalculatorText}>Recommendation</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Image source={images.MutualFundTrazzy} style={styles.moneyImgStyle} />
        </TouchableOpacity>
      </View>
    )
  }



  return (
    <View style={CommonStyles.container}>
      <Logo style={styles.centerContainer} />
      <ImageBackground source={images.BGImg} style={styles.scrollContent}>
        {renderHeader()}
        {BlueBoxContainer()}
        <ScrollView
          style={styles.paddingScrollContent} >
          {renderMiddleware()}
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
    paddingHorizontal: responsiveWidth(4),
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
  newRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(0.5)
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
    marginBottom: responsiveHeight(4)
  },
  balanceBtn: {
    top: responsiveHeight(-2),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    marginHorizontal: responsiveWidth(5),
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
    width: responsiveWidth(37),
    marginTop: responsiveHeight(0.5),
    textAlign: 'center'

  },
  smallText: {
    fontSize: 11,
    fontFamily: Fonts.Medium600,
    color: Colors.blue,
    width: responsiveWidth(30),
    marginTop: responsiveHeight(0.5)
  },
  portfolioRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    justifyContent: 'space-between',
  },

  nameText: {
    fontSize: 16,
    fontFamily: Fonts.Medium600,
    color: Colors.white
  },
  subheading: {
    fontSize: 22,
    fontFamily: Fonts.Semibold700,
    color: Colors.white
  },
});

export default MutualFund;

