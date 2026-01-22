import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground, ScrollView, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { LoanBtn, InsuranceBtn, LearnmoreCard, MutualFundCard, ReferImg, SIPImg, CompleteKycCard, InvesTekLogo, StartSIP, DailySip, OneTime, Logo, Money, InvestorBtn, ExistingInvestor, BondIcon, BondsBtn, CalculatorImg, HiAiImg, TrazzyImg } from '../../Assets/svg';
import { CommonStyles } from '../../Themes/CommonStyles';
import PromoCard from '../../Components/PromoCard';
import images from '../../Themes/Images';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import BlueBoxContainer from '../../Components/BlueBoxContainer';
import SchemeContainer from '../../Components/SchemeContainer';
import WebViewContainer from '../../Components/WebViewContainer';
import { formatCurrency } from '../../utils/formatCurrency';
import getEnvVars from '../../utils/config';
import ServiceBox from '../../Components/ServiceBox';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
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



  const fetchMfStatus = async () => {
    try {
      const ClientId = await AsyncStorage.getItem("clientID");

      if (!ClientId) {
        console.warn("No client ID found in AsyncStorage");
        return;
      }

      const body = { client_id: Number(ClientId) };
      const response = await axios.post(
        `${baseURL}${endpoints.IS_READY_FOR_PURCHASE}`,
        body
      );

      if (response.data?.status && response.data?.response?.status) {
        const data = response.data.response.data;
        setMfStatus(data);

        setDetailsCompleted(data?.detailsCompleted);
      } else {
        setMfStatus(null);
        setDetailsCompleted(false);
      }
    } catch (error) {
      console.error("isReadyForPurchase API error:", error.message);
      setMfStatus(null);
      setDetailsCompleted(false);
    }
  };
  const handleMfAction = async (action) => {
    if (!mfStatus) {
      Alert.alert(
        "Unavailable",
        "Unable to fetch investment status. Please try again later."
      );
      return;
    }

    const ClientId = await AsyncStorage.getItem("clientID");

    if (!ClientId) {
      console.warn("No client ID found in AsyncStorage.");
      return;
    }
    if (mfStatus.detailsCompleted && mfStatus.clientInvestorProfileCreated) {
      if (action === "sip") navigation.navigate("SIPFirstForm");
      else if (action === "onetime") navigation.navigate("OneTimeFirstForm");
      else if (action === "order") navigation.navigate("OrderPage");
      else if (action === "kyc_redirect") {
        Alert.alert("Info", "Your KYC is already complete.");
      }
      return;
    }

    if (mfStatus.detailsCompleted && !mfStatus.clientInvestorProfileCreated) {
      try {
        setLoading(true);

        const createResp = await axios.post(
          `${baseURL}${endpoints.CREATE_INVESTOR_PROFILE}`,
          { client_id: Number(ClientId) }
        );

        const apiResponse = createResp.data?.response;
        const backendMsg = apiResponse?.message || "";
        if (apiResponse?.status === true) {
          Alert.alert(
            "Message",
            backendMsg || "Investor profile created successfully.",
            [
              {
                text: "OK",
                onPress: () => {
                  setMfStatus(prev => ({
                    ...prev,
                    clientInvestorProfileCreated: true,
                  }));

                  if (action === "sip") navigation.navigate("SIPFirstForm");
                  else if (action === "onetime") navigation.navigate("OneTimeFirstForm");
                  else if (action === "order") navigation.navigate("OrderPage");
                  else if (action === "kyc_redirect") navigation.navigate("Home");
                },
              },
            ]
          );
          return;
        }

        if (apiResponse?.status === false && apiResponse?.redirectTo === "kyc_form") {
          Alert.alert(
            "KYC Required",
            backendMsg || "Please complete your KYC verification first.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("PersonalDetails"),
              },
            ]
          );
          return;
        }

        if (apiResponse?.status === false && !apiResponse?.redirectTo) {
          Alert.alert(
            "Message",
            backendMsg || "Something went wrong. Please try again later.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Home"),
              },
            ]
          );
          return;
        }

        if (backendMsg.includes("Duplicate entry")) {
          setMfStatus(prev => ({
            ...prev,
            clientInvestorProfileCreated: true,
          }));

          if (action === "sip") navigation.navigate("SIPFirstForm");
          else if (action === "onetime") navigation.navigate("OneTimeFirstForm");
          else if (action === "order") navigation.navigate("OrderPage");
          else if (action === "kyc_redirect") navigation.navigate("Home");

          return;
        }

        if (action === "order") {
          Alert.alert(
            "No Transactions",
            "No transactions done. Please click on 'Start SIP' or 'Lumpsum' to place an order.",
            [{ text: "OK" }]
          );
          return;
        }

        Alert.alert("Failed", backendMsg || "Unable to create investor profile");
      } catch (error) {
        console.error("❌ CreateInvestorProfile API error:", error.message);
        Alert.alert(
          "Error",
          "Unable to create investor profile. Please try again later."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!mfStatus.detailsCompleted) {
      if (action === "order") {
        Alert.alert(
          "No Transactions",
          "No transactions done. Please click on 'Start SIP' or 'Lumpsum' to place an order.",
          [{ text: "OK" }]
        );
        return;
      }

      const redirectRaw = (mfStatus.redirectTo || "").toLowerCase();
      const backendMsg =
        mfStatus.message ||
        `Incomplete Information. Please complete your ${mfStatus.redirectTo || ""}`;

      const steps = [
        { key: "profile", screen: "EditProfile" },
        { key: "contact", screen: "EditContactDetails" },
        { key: "kyc", screen: "EditKyc" },
        { key: "bank", screen: "BankDetailsFirstForm" },

      ];

      // Identify all pending screens in order
      const pendingScreens = steps
        .filter(step => redirectRaw.includes(step.key))
        .map(step => step.screen);

      if (pendingScreens.length > 0) {
        const firstScreen = pendingScreens[0];
        const remainingScreens = pendingScreens.slice(1);

        Alert.alert("Action Required", backendMsg, [
          {
            text: "OK",
            onPress: () => navigation.navigate(firstScreen, { pendingScreens: remainingScreens, nextScreen: remainingScreens[0] }),
          },
        ]);
      } else {
        // Fallback if something is weird but detailsCompleted is false
        Alert.alert("Action Required", backendMsg, [
          { text: "OK", onPress: () => navigation.navigate("EditProfile") }
        ]);
      }
    }
  };

  const fetchDetailsCompleted = async () => {
    try {
      const ClientId = await AsyncStorage.getItem("clientID");
      if (!ClientId) {
        console.warn("No client ID found in AsyncStorage.");
        return;
      }

      const body = { client_id: Number(ClientId) };
      const response = await axios.post(
        `${baseURL}${endpoints.IS_READY_FOR_PURCHASE}`,
        body
      );

      if (response.data?.status && response.data?.response?.status) {
        const completed = response.data.response.data?.detailsCompleted;
        setDetailsCompleted(completed);

      } else {
        setDetailsCompleted(false);
      }
    } catch (error) {
      console.error("isReadyForPurchase API error:", error.message);
      setDetailsCompleted(false);
    }
  };
  const handleStartSip = () => handleMfAction("sip");
  const handleStartLumpsum = () => handleMfAction("onetime");

  const handleKYC = () => {
    handleMfAction('kyc_redirect');
  };
  const handleOrders = () => {
    handleMfAction('order');
  };


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
      fetchMfStatus();
      fetchDetailsCompleted();
      fetchClientDetails();
    }, [])
  );

  const RenderServices = () => {
    return (
      <View>
        <View style={styles.row}>
          <ServiceBox
            title="Start SIP"
            SvgIcon={StartSIP}
            borderColor={Colors.yellow}
            width={responsiveWidth(26)}
            marginHorizontal={responsiveWidth(0.2)}
            onPress={handleStartSip} />
          <ServiceBox title="LumpSum"
            SvgIcon={OneTime}
            borderColor={Colors.newBlue}
            width={responsiveWidth(26)}
            marginHorizontal={responsiveWidth(5)}
            onPress={handleStartLumpsum} />
          <ServiceBox
            title="Orders"
            SvgIcon={DailySip}
            borderColor={Colors.borderRed}
            width={responsiveWidth(26)}
            marginHorizontal={responsiveWidth(1)}
            svgwidth={Platform.select({ ios: 50, android: 45 })}
            svgheight={Platform.select({ ios: 53, android: 46 })}
            onPress={handleOrders} />
        </View>
        <PromoCard
          SvgImage={SIPImg}
          title="Invest now in SIP"
          subtitle="Get best out of best of your money, invest not in best SIP’s"
          ctaText="Start Now →"
          borderColor={Colors.purple}
          onPress={handleStartSip}
        />
      </View>

    )
  }


  const RenderInvestmmentOverview = () => {

    const currentCost = portfolioData?.data?.returns?.data?.rows?.[0]?.[1] || 0;
    const currentValue = portfolioData?.data?.returns?.data?.rows?.[0]?.[2] || 0;
    const currentReturns = portfolioData?.data?.returns?.data?.rows?.[0]?.[3] || 0;
    const absoluteReturn = portfolioData?.data?.returns?.data?.rows?.[0]?.[4] || 0;
    const xiir = portfolioData?.data?.returns?.data?.rows?.[0]?.[6] || 0;

    return (
      <View>
        <View style={styles.portfolioRow}>
          <Text allowFontScaling={false} style={styles.subheading}>Investment Overview</Text>
        </View>
        <View style={[CommonStyles.containerBox, { marginBottom: responsiveHeight(2) }]}>
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
            <Text allowFontScaling={false} style={styles.nameText}>Unrealised Gain</Text>
            <Text allowFontScaling={false} style={styles.nameText}>
              {formatCurrency(currentReturns)}
            </Text>
          </View>

          <View style={styles.newRow}>
            <Text allowFontScaling={false} style={styles.nameText}>Realised Gain</Text>
            <Text allowFontScaling={false} style={styles.nameText}>
              ₹0.00
            </Text>
          </View>
          <View style={styles.newRow}>
            <Text allowFontScaling={false} style={styles.nameText}>XIRR</Text>
            <Text allowFontScaling={false} style={styles.nameText}>
              {xiir}
            </Text>
          </View>
          <View style={[styles.newRow, { borderBottomWidth: 0 }]}>
            <Text allowFontScaling={false} style={styles.nameText}>Absolute Return</Text>
            <Text allowFontScaling={false} style={styles.nameText}>
              {absoluteReturn}
            </Text>
          </View>
          {/* <View style={[styles.newRow, { borderBottomWidth: 0 }]}>
            <Text allowFontScaling={false} style={styles.nameText}>Daily Changes</Text>
            <Text allowFontScaling={false} style={styles.nameText}>
              0.00
            </Text>
          </View> */}
        </View>

      </View>
    );
  };

  const BlueBoxContainer = () => {

    const currentCost = portfolioData?.data?.returns?.data?.rows?.[0]?.[1] || 0;
    const currentValue = portfolioData?.data?.returns?.data?.rows?.[0]?.[2] || 0;
    const currentReturns = portfolioData?.data?.returns?.data?.rows?.[0]?.[3] || 0;

    return (
      <LinearGradient
        colors={['#9FD1FC', '#002972']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blueContainerStyle}
      >
        <Text allowFontScaling={false} style={styles.portfolioAmount}>{formatCurrency(currentValue)}</Text>
        <Text allowFontScaling={false} style={styles.changeText}>
          1 day change: ₹0.00 <Text allowFontScaling={false} style={styles.positiveChange}>  ▲ 0% </Text>
        </Text>

        <View style={styles.infoRow}>
          <View>
            <Text allowFontScaling={false} style={styles.infoLabel}>Invested</Text>
            <Text allowFontScaling={false} style={styles.infoValue}>{formatCurrency(currentCost)}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.infoLabel}>Current Returns</Text>
            <Text allowFontScaling={false} style={styles.infoValue}>{formatCurrency(currentReturns)}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.infoLabel}></Text>
            <Text allowFontScaling={false} style={styles.positiveChange}></Text>
          </View>
        </View>
      </LinearGradient>
    )
  }

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
          <TouchableOpacity style={styles.moneyImgStyle}  onPress={() => navigation.navigate('LarkWebView', {
              phoneNumber: '9999999999',
            })}>
            <LoanBtn />
          </TouchableOpacity>
           <View style={styles.rowStyle}>
            <TouchableOpacity >
             <CalculatorImg/>
            </TouchableOpacity>
            <TouchableOpacity>
              <HiAiImg/>
            </TouchableOpacity>
          </View>
            <TouchableOpacity style={styles.moneyImgStyle}>
              <TrazzyImg/>
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
      paddingBottom:responsiveHeight(13)
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

export default Home;

