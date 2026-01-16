import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import getEnvVars from '../../utils/config';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';



const BlueBoxContainer = () => {

  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
    const { baseURL, endpoints } = getEnvVars();

  const fetchDashboardPortfolio = async () => {
    try {
      const ClientId = await AsyncStorage.getItem('clientID');

      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        return;
      }
      const response = await axios.get(`${baseURL}${endpoints.DASHBOARD}${ClientId}`);
      if (response.data?.response?.status) {
        setPortfolioData(response.data.response);

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




  const RenderportFolio = () => {

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
            <Text allowFontScaling={false} style={styles.infoLabel}>Returns %</Text>
            <Text allowFontScaling={false} style={styles.positiveChange}>▲ 0%</Text>
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
    <View>
      {portfolioData && (
        <>
          <RenderportFolio />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1)
  }
});

export default BlueBoxContainer;
