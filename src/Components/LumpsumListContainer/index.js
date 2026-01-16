import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonStyles } from '../../Themes/CommonStyles';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';

const LumpsumListContainer = ({ refreshTrigger, onOrderIdsFetched, trxType, onAmountSelected }) => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [cartOrders, setCartOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { refreshCartCounts } = useCartCounts();
  const [orderIds, setOrderIds] = useState([]);

  const fetchCartOrders = async () => {
    try {
      setLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) return;
      const response = await axios.get(
        `${baseURL}${endpoints.GET_CART_ORDERS}${ClientId}?trx_type=${trxType}`
      );

      const data = response?.data?.response?.data || [];
      if (response?.data?.response?.status && data.length > 0) {
        setCartOrders(data);
        refreshCartCounts();
        const ids = data.map(item => item.id);
        setOrderIds(ids);

        const totalAmount = data.reduce(
          (sum, item) => sum + Number(item?.amount || 0),
          0
        );
        if (onAmountSelected) {
          onAmountSelected(totalAmount);
        }
        if (onOrderIdsFetched) onOrderIdsFetched(ids);
      } else {
        setCartOrders([]);
        if (onOrderIdsFetched) onOrderIdsFetched([]);
        if (onAmountSelected) onAmountSelected(0);
      }
    } catch (error) {
      console.error('Error fetching cart orders:', error.message);
      setCartOrders([]);
      if (onOrderIdsFetched) onOrderIdsFetched([]);
      if (onAmountSelected) onAmountSelected(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartOrders();
    refreshCartCounts();
  }, [refreshTrigger, trxType]);

  const handleDeleteOrder = async (orderId) => {
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        Alert.alert('Error', 'Client ID not found');
        return;
      }

      setDeleting(orderId);

      const response = await axios.delete(
        `${baseURL}${endpoints.CART_ORDERS}${ClientId}/${orderId}?trx_type=${trxType}`
      );

      const res = response.data?.response;

      if (res?.status) {
        setCartOrders((prev) => prev.filter((order) => order?.id !== orderId));
        fetchCartOrders();
        refreshCartCounts();
      } else {
        Alert.alert('Error', res?.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Delete order error:', error.message);
      Alert.alert('Error', 'Something went wrong while deleting the order');
    } finally {
      setDeleting(null);
    }
  };

  const RenderPortfolio = ({ item }) => (

    <View style={styles.blueContainerStyle}>
      <View style={styles.referralRow}>
        <Text allowFontScaling={false} style={styles.portfolioText}>
          {item.scheme_name}
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Confirm Delete",
              "Are you sure you want to delete this order?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => handleDeleteOrder(item.id) }
              ]
            )
          }
        >
          {deleting === item.id ? (
            <Loader size={15} color={Colors.red} />
          ) : (
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.red}
              style={{ marginTop: responsiveHeight(0.5) }}
            />
          )}
        </TouchableOpacity>
      </View>
      <Text allowFontScaling={false} style={styles.portfolioText}>
        Amount -{' '}
        <Text allowFontScaling={false} style={styles.secureNowText}>
          {formatCurrency(item?.amount)}
        </Text>
      </Text>
    </View>
  );


  return (
    <View>
      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : cartOrders.length > 0 ? (
        <FlatList
          data={cartOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RenderPortfolio item={item} />}
          contentContainerStyle={{ paddingBottom: responsiveHeight(2) }}
        />
      ) : (
        <View style={[CommonStyles.containerBox, styles.box]}>
          <Ionicons name="cart-outline" size={40} color={Colors.black} style={{ alignSelf: 'center' }} />
          <Text style={styles.noDataText}>No cart orders found.</Text>
        </View>
      )}
    </View>
  );

};



const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontSize: 18,
    marginTop: responsiveHeight(1),
    fontWeight: '500'
  },
  scrollContent: {
    paddingBottom: responsiveHeight(2),
    backgroundColor: 'red'
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  blueContainerStyle: {
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(5),
    borderColor: Colors.blue,
    borderWidth: 1.2
  },
  portfolioText: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(70),
    lineHeight: 24
  },
  secureNowText: {
    color: Colors.newGreen
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(6)
  },
  noDataText: {
    fontFamily: Fonts.Semibold700,
    fontSize: 16,
    color: Colors.blue,
    marginTop: responsiveHeight(2),
    alignSelf: 'center'
  },
  box: {
    paddingVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3)
  }
});

export default LumpsumListContainer;
