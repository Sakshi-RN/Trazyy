import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonStyles } from '../../Themes/CommonStyles';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './styles';
import { useCartCounts } from '../../utils/CartCountContext';
import { EmptyCart } from '../../Assets/svg';
import AddMoreLumpsum from '../AddMoreLumpsum';
import CustomButton from '../CustomButton';
import CustomBackButton from '../CustomBackButton';
import getEnvVars from '../../utils/config';

const MyCartListContainer = ({
  trxType,
  onOrderIdsFetched,
  refreshTrigger,
  renderFooter,
  onCountFetched,
  onAmountSelected
}) => {
  const navigation = useNavigation();
  const [cartOrders, setCartOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [counts, setCounts] = useState({ sipCount: 0, lumpsumCount: 0 });
  const [refreshCart, setRefreshCart] = useState(false);
  const [isSheetVisible, setSheetVisible] = useState(false);
  const { refreshCartCounts } = useCartCounts();
  const [orderIds, setOrderIds] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payLoading, setPayLoading] = useState(false);
  const { baseURL, endpoints } = getEnvVars();



  const fetchCartOrders = async () => {
    try {
      setLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) return;
      const response = await axios.get(
        `${baseURL}${endpoints.GET_CART_ORDERS}${ClientId}?trx_type=${trxType}`
      );
      const resp = response?.data?.response;
      const data = resp?.data || [];
      setCounts({
        sipCount: resp?.sipCount || 0,
        lumpsumCount: resp?.lumpsumCount || 0,
      });
      if (onCountFetched) onCountFetched(resp?.sipCount || 0, resp?.lumpsumCount || 0);

      if (resp?.status && data.length > 0) {
        setCartOrders(data);
        const ids = data.map((item) => item.id);
        setOrderIds(ids);
        const totalAmount = data.reduce(
          (sum, item) => sum + Number(item?.amount || 0),
          0
        );

        setTotalAmount(totalAmount);

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
  }, [refreshTrigger, trxType, refreshCart]);


  const handleEmptyCart = async () => {
    try {
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) return;
      Alert.alert(
        'Confirm',
        'Are you sure you want to empty all cart orders?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Delete',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              try {
                const response = await axios.delete(
                  `${baseURL}${endpoints.CART_ORDERS}${ClientId}/all?trx_type=${trxType}`
                );
                const res = response.data?.response;

                if (res?.status && res?.deleted_count > 0) {
                  setRefreshCart(prev => !prev);
                  refreshCartCounts();
                } else {
                  Alert.alert('Info', res?.message || 'No cart orders found to delete');
                }
              } catch (error) {
                console.error('Empty cart error:', error.message);
                Alert.alert('Error', 'Something went wrong while emptying the cart');
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Empty cart error:', error.message);
      Alert.alert('Error', 'Something went wrong');
    }
  };

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
  const handleNext = async () => {

    if (orderIds.length === 0) {
      Alert.alert('No Orders', 'No valid cart orders found to process.');
      return;
    }

    try {
      setPayLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail?.trim() === 'testapp@investek.in') {
        setLoading(false);
        navigation.navigate('CommonSuccessPage');
        return;
      }
      const validOrderIds = orderIds.filter((id) => id && Number.isInteger(id));
      const body = {
        client_id: Number(clientId),
        order_ids: validOrderIds,
      };
      let apiURL = "";
      let navigationScreen = "";
      let extraPayload = {};

      if (trxType === "sip") {
        apiURL = `${baseURL}${endpoints.SIP_PURCHASE_BATCH}`;
        navigationScreen = "SIPSecondForm";
      } else {
        apiURL = `${baseURL}${endpoints.LUMPSUM_PURCHASE_BATCH}`;
        extraPayload = {
          payment_postback_url: "investek://payment_success",
        };
        navigationScreen = "OneTimeThirdForm";
      }

      const response = await axios.post(apiURL, { ...body, ...extraPayload }, {
        headers: { "Content-Type": "application/json" },
      });

      const res = response.data?.response;

      if (res?.status === true && res?.data?.results?.length > 0) {
        const results = res.data.results;
        if (trxType === "sip") {
          const ids = results.map(item => item.id);
          navigation.navigate(navigationScreen, { ids, selected_amount: totalAmount });
        } else {
          const purchaseIds = results.map(item => item.id);
          const oldIds = results.map(item => item.old_id);
          navigation.navigate(navigationScreen, { purchaseIds, oldIds });
        }

      } else {
        Alert.alert('Failed', res?.message || 'Purchase failed');
      }

    } catch (error) {
      console.error("❌ Purchase API Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.response?.message || "Something went wrong");
    } finally {
      setPayLoading(false);
    }
  };


  const getAddMoreOptions = () => {
    if (trxType === 'sip') {
      return {
        title: "Add More Funds To SIP",
        folioOption: { label: 'Choose From Existing SIP Folios', navigateTo: 'SipFolioList' },
        schemeOption: { label: 'Choose New SIP Scheme', navigateTo: 'SIPFirstForm' }
      };
    } else {
      return {
        title: "Add More Funds To Lumpsum",
        folioOption: { label: 'Choose From Existing Lumpsum Folios', navigateTo: 'LumpsumpFolioList' },
        schemeOption: { label: 'Choose New Lumpsum Scheme', navigateTo: 'OneTimeFirstForm' }
      };
    }
  };
  const AddMoreSection = () => (
    <View style={styles.btnRowss}>
      <CustomBackButton title={'Add More'} onPress={() => setSheetVisible(true)} />
      <CustomButton
        textStyle={styles.btnText}
        buttonStyle={[
          styles.submitbtn,
          (payLoading || orderIds.length === 0) && { backgroundColor: Colors.lightblue },
        ]}
        title={payLoading ? <Loader /> : "Proceed to Pay"}
        disabled={payLoading || orderIds.length === 0}
        onPress={handleNext}
      />
    </View>
  );


  return (
    <View>
      <TouchableOpacity style={styles.emptyBtn} onPress={handleEmptyCart}>
        <EmptyCart />
      </TouchableOpacity>
      <View style={styles.scrollContent}>
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
            ListFooterComponent={renderFooter}
          />

        ) : (
          <View style={[CommonStyles.containerBox, styles.box]}>
            <Ionicons name="cart-outline" size={40} color={Colors.black} style={{ alignSelf: 'center' }} />
            <Text style={styles.noDataText}>No cart orders found.</Text>
          </View>
        )}
      </View>
      <AddMoreSection />
      <AddMoreLumpsum
        isVisible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        {...getAddMoreOptions()}
      />
    </View>
  );
};

export default MyCartListContainer;
