import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SecondProgress, EmptyCart } from '../../Assets/svg';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import AddMoreLumpsum from '../../Components/AddMoreLumpsum';
import LumpsumListContainer from '../../Components/LumpsumListContainer';
import CustomBackButton from '../../Components/CustomBackButton';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';



const OneTimeSecondForm = () => {
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const [loading, setLoading] = useState(false);
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [refreshCart, setRefreshCart] = useState(false);
  const [orderIds, setOrderIds] = useState([]);
  const handleGoBack = () => setSheetVisible(true);
  const { refreshCartCounts } = useCartCounts();

  const handleNext = async () => {
    if (orderIds.length === 0) {
      Alert.alert('No Orders', 'No valid cart orders found to process.');
      return;
    }

    try {
      setLoading(true);
      const clientId = await AsyncStorage.getItem('clientID');
      const userEmail = await AsyncStorage.getItem('userEmail');

      if (userEmail?.trim() === 'testapp@investek.in') {
        setLoading(false);
        navigation.navigate('CommonSuccessPage');
        return;
      }

      const postbackUrl = "investek://payment_success";
      const validOrderIds = orderIds.filter((id) => id && Number.isInteger(id));
      const body = {
        client_id: Number(clientId),
        payment_postback_url: postbackUrl,
        order_ids: validOrderIds,
      };
      const response = await axios.post(
        `${baseURL}${endpoints.LUMPSUM_PURCHASE_BATCH}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = response.data?.response;
      if (res?.status === true && res?.data?.results?.length > 0) {
        const results = res.data.results;
        const purchaseIds = results.map(item => item.id);
        const oldIds = results.map(item => item.old_id);

        navigation.navigate('OneTimeThirdForm', {
          purchaseIds,
          oldIds,
        });
      } else {
        Alert.alert('Failed', res?.message || 'Purchase failed');
      }

    } catch (error) {
      console.error("❌ Purchase API Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.response?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const AddReferalDetails = () => (
    <View style={styles.btnRowss}>
      <CustomBackButton title={'Add More'} onPress={handleGoBack} />
      <CustomButton
        textStyle={styles.btnText}
        buttonStyle={[
          styles.submitbtn,
          (loading || orderIds.length === 0) && { backgroundColor: Colors.lightblue },
        ]}
        title={loading ? <Loader /> : "Proceed to Pay"}
        disabled={loading || orderIds.length === 0}
        onPress={handleNext}

      />
    </View>
  );



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
                  `${baseURL}${endpoints.CART_ORDERS}${ClientId}/all?trx_type=lumpsum`
                );
                const res = response.data?.response;
                if (res?.status && res?.deleted_count > 0) {
                  setRefreshCart((prev) => !prev);
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

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Lumpsum" showBack={true} />
      <SecondProgress style={styles.progressbarStyle} />
      <TouchableOpacity style={styles.emptyBtn} onPress={handleEmptyCart}>
        <EmptyCart />
      </TouchableOpacity>
      <View style={styles.scrollContent}>
        <LumpsumListContainer
          trxType="lumpsum"
          refreshTrigger={refreshCart}
          onOrderIdsFetched={(ids) => setOrderIds(ids)}
        />
        <AddReferalDetails />
        <AddMoreLumpsum
          isVisible={isSheetVisible}
          onClose={() => setSheetVisible(false)}
          title="Add More Funds To Lumpsum"
          folioOption={{ label: 'Choose From Existing Lumpsum Folios', navigateTo: 'LumpsumpFolioList' }}
          schemeOption={{ label: 'Choose New Lumpsum Scheme', navigateTo: 'OneTimeFirstForm' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
  },
  emptyBtn: {
    alignItems: 'flex-end',
    marginTop: responsiveHeight(1.5),
    marginRight: responsiveWidth(6)
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  inputWidth: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '45%',
  },
  submitbtn: {
    paddingHorizontal: responsiveWidth(6),
    width: '50%',
  },
  btnText: {
    fontSize: 13,
    fontFamily: Fonts.Semibold700,
  },
  errorText: {
    color: Colors.red,
    fontSize: 18,
    marginTop: responsiveHeight(1),
    fontWeight: '500'
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(3),
    marginHorizontal: responsiveWidth(6)
  },
  inputViewStyle: {
    borderColor: Colors.lightgrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
    width: '47%'
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    marginTop: responsiveHeight(0.5),
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
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  label: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
  },
  textStyle: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(2)
  },
  termsStyle: {
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  },
  webView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsiveHeight(5),
    height: responsiveHeight(60)
  },
});

export default OneTimeSecondForm;
