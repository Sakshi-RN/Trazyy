
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { FailuresImg, OneTimeFailure, SuccessImg, ThirdProgress } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { useCartCounts } from '../../utils/CartCountContext';
import getEnvVars from '../../utils/config';

const OneTimeSucessPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { baseURL, endpoints } = getEnvVars();
  const { paymentID } = route.params || {};
  const { refreshCartCounts } = useCartCounts();

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const fetchPaymentStatus = useCallback(async () => {
    if (!paymentID) return;

    try {
      setLoading(true);

      const body = {
        purchase_ids: Array.isArray(paymentID)
          ? paymentID
          : [paymentID].filter(Boolean),
        type: "lumpsum",
      };

      const response = await axios.put(
        `${baseURL}${endpoints.UPDATE_CART_STATUS}`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      const res = response.data?.response;

      if (res?.status === true) {
        setPaymentStatus("success");

        // refresh global cart count
        refreshCartCounts();
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  }, [paymentID]);

  // ⬇️ CALLS API ONLY WHEN SCREEN COMES INTO FOCUS
  useFocusEffect(
    useCallback(() => {
      fetchPaymentStatus();
    }, [fetchPaymentStatus])
  );

  const renderSuccessView = () => (
    <View>
      <ThirdProgress style={styles.progressbarStyle} />
      <SuccessBox
        title="Investment successful"
        ImageComponent={SuccessImg}
        buttonTitle={'Explore More'}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );

  const renderUnSuccessView = () => (
    <View>
      <OneTimeFailure style={styles.progressbarStyle} />
      <SuccessBox
        title="Investment unsuccessful"
        ImageComponent={FailuresImg}
        buttonTitle={'Retry'}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'OneTimeFirstForm' }]
          });
        }}
      />
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Lumpsum" showBack={true} />

      {loading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : paymentStatus === "success" ? (
        renderSuccessView()
      ) : (
        renderUnSuccessView()
      )}
    </View>
  );
};

export default OneTimeSucessPage;

const styles = StyleSheet.create({
  progressbarStyle: {
    marginTop: 20,
    alignSelf: 'center',
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
