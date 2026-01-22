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

const MutualFund = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [mfStatus, setMfStatus] = useState(null);
  const [schemeData, setSchemeData] = useState([]);
  const [folioData, setFolioData] = useState([]);
  const [detailsCompleted, setDetailsCompleted] = useState(false);
  const [clientName, setClientName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchClientDetails = async () => {
    try {
      const storedDetails = await AsyncStorage.getItem("clientsDetails");
      if (storedDetails) {
        const details = JSON.parse(storedDetails);
        setClientName(details.firstname || '');
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  const getGreetingData = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { greeting: "Good Morning", background: images.MrngBg };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good Afternoon", background: images.NoonBg };
    } else if (hour >= 17 && hour < 20) {
      return { greeting: "Good Evening", background: images.EvngBg };
    } else {
      return { greeting: "Good Evening", background: images.NightBg };
    }
  };

  const { greeting, background } = getGreetingData();

  const renderHeader = () => {
    const firstName = portfolioData?.firstname;
    const nameToDisplay = (firstName && firstName !== 'null') ? firstName : clientName;
    const displayName = nameToDisplay ? nameToDisplay : '';

    return (
      <ImageBackground source={background} imageStyle={{ borderRadius: 18 }}>
        <WebViewContainer />
        <Text allowFontScaling={false} style={styles.prflNameText}>{`${greeting} ${displayName},`}</Text>
        <Text allowFontScaling={false} style={styles.quoteText}>“An investment in knowledge pays the best interest.”</Text>
        <Text allowFontScaling={false} style={styles.autorText}>— Benjamin Franklin</Text>
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
      console.log("Dashboard Response:", JSON.stringify(response.data, null, 2));

      if (response.data?.response?.status) {
        const res = response.data.response;
        // console.log("@@@@response", res);
        setPortfolioData(res);
        const schemes = res.data.holdings.folios.flatMap(folio =>
          folio.schemes.map(scheme => ({
            name: scheme.name,
            category: scheme.type,
            invested: scheme.invested_value.amount,
            currentValue: scheme.market_value.amount,
            xirr: res.data.returns?.data?.rows?.[0]?.[6] ?? 0
          }))
        );
        setSchemeData(schemes);
        const folios = res.data.holdings.folios.map(folio => ({
          folioNumber: folio.folio_number,
          schemes: folio.schemes.map(scheme => ({
            name: scheme.name,
            category: scheme.type,
            invested: scheme.invested_value.amount,
            currentValue: scheme.market_value.amount
          }))
        }));
        setFolioData(folios);
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
      fetchClientDetails();
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
              <CalculatorImg />
            </TouchableOpacity>
            <TouchableOpacity>
              <HiAiImg />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.moneyImgStyle}>
            <TrazzyImg />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.blue
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.Semibold700,
    color: Colors.blue
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2)
  },
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
  portfolioRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    justifyContent: 'space-between',
  },
  newRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.5),
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1.5
  },
  nameText: {
    fontSize: 16,
    fontFamily: Fonts.Medium600,
    color: Colors.black
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
  blueContainerStyle: {
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    marginTop: responsiveHeight(3),

  },

  portfolioAmount: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: Fonts.Semibold700,
  },

  changeText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.Medium600,
  },

  positiveChange: {
    fontSize: 14,
    color: Colors.newGreen,
    fontFamily: Fonts.Medium600,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },

  infoLabel: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.Medium600,
  },

  infoValue: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.Medium600,
    marginTop: 2,
  },
});

export default MutualFund;

