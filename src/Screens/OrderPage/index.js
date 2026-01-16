import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { DailySip, OneTime, StartSIP } from '../../Assets/svg';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import ServiceBox from '../../Components/ServiceBox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import OrderPageCard from '../../Components/OrderPageCard';
import { formatCurrency } from '../../utils/formatCurrency';
import getEnvVars from '../../utils/config';

const OrderPage = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [noOrdersMessage, setNoOrdersMessage] = useState('');

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoadingOrders(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage');
        return;
      }
      const response = await axios.get(
        `${baseURL}${endpoints.FETCH_ALL_TRX}${ClientId}`
      );
      const apiRes = response.data?.response;
      if (
        apiRes?.status === false ||
        !Array.isArray(apiRes?.data) ||
        apiRes.data.length === 0
      ) {
        setOrders([]);
        setNoOrdersMessage(apiRes?.message || 'No orders found.');
      } else {
        setNoOrdersMessage('');
        const formattedOrders = apiRes.data.map(item => ({
          name: item?.schemeName || "N/A",
          purchaseAmount: item?.amount || 0,
          PurchaseStatus: item?.type || "N/A",
          excutedStatus: item?.state || "N/A",
          purchaseDate: item?.created_at || ""
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setOrders([]);
      setNoOrdersMessage('Could not fetch orders. Please try again later.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const RenderOrders = () => (
    <View style={{ paddingVertical: responsiveHeight(2) }}>
      {loadingOrders ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerLogo}>
          <Text allowFontScaling={false} style={styles.noOrdersText}>
            {noOrdersMessage}
          </Text>
        </View>
      ) : (
        orders.map((scheme, index) => (
          <OrderPageCard
            key={index}
            name={scheme.name}
            purchaseAmount={formatCurrency(scheme.purchaseAmount)}
            PurchaseStatus={scheme.PurchaseStatus}
            excutedStatus={scheme.excutedStatus}
            purchaseDate={scheme.purchaseDate}
          />
        ))
      )}
    </View>
  );

  const RenderServices = () => (
    <View>
      <View style={styles.row}>
        <ServiceBox
          title="Start SIP"
          SvgIcon={StartSIP}
          borderColor={Colors.yellow}
          width={responsiveWidth(26)}
          marginHorizontal={responsiveWidth(0.2)}
          onPress={() => navigation.navigate('SIPFirstForm')}
        />
        <ServiceBox
          title="Lumpsum"
          SvgIcon={OneTime}
          borderColor={Colors.newBlue}
          width={responsiveWidth(26)}
          marginHorizontal={responsiveWidth(5)}
          onPress={() => navigation.navigate('OneTimeFirstForm')}
        />
        <ServiceBox
          title="Order"
          SvgIcon={DailySip}
          borderColor={Colors.borderRed}
          width={responsiveWidth(26)}
          marginHorizontal={responsiveWidth(1)}
        />
      </View>
    </View>
  );

  return (
    <View style={[
      CommonStyles.container,
      { paddingBottom: Platform.OS === 'ios' ? responsiveHeight(12) : responsiveHeight(15) }
    ]}>
      <CustomHeader title="Orders" showBack />
      <ScrollView style={styles.scrollContent}>
        {orders.length === 0 && !loadingOrders ? (
          <>
            <RenderServices />
            <View style={styles.centerLogo}>
              <Text allowFontScaling={false} style={styles.noOrdersText}>
                {noOrdersMessage}
              </Text>
            </View>
          </>
        ) : (
          <RenderOrders />
        )}
      </ScrollView>
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2)
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5)
  },

  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1)
  },
  noOrdersText: {
    textAlign: 'center',
    fontFamily: Fonts.Semibold700,
    fontSize: 16,
    color: Colors.GREEN,
    marginTop: responsiveHeight(10),
  },



});

export default OrderPage;
