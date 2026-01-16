import { View, StyleSheet, ScrollView, Text } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatCurrency } from '../../utils/formatCurrency';
import CustomBackButton from '../../Components/CustomBackButton';


const RedeemPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { schemeData } = route.params || {};


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  };

  const handleRedeemAmount = (item) => {
    navigation.navigate('RedeemSubmitForm', {
      schemeData: {
        id: item?.id,
        name: item?.name,
        folioNumber: item?.folio_number,
        scheme: item?.isin,
        navValue: formatCurrency(item?.nav?.value),
        navDate: formatDate(item?.nav?.as_on),
        valueAtNav: formatCurrency(item?.market_value?.amount),
        availableUnits: item?.holdings?.units?.toFixed(4),
        redeemableUnits: item?.holdings?.redeemable_units?.toFixed(4),
        valueAtCost: formatCurrency(item?.invested_value?.amount),
        unrealizedPL: formatCurrency(
          item?.market_value?.amount - item?.invested_value?.amount
        ),
        currentValue: formatCurrency(item?.market_value?.amount),
        holdingMode: item?.type || 'N/A',
        payoutAmount: formatCurrency(item?.payout?.amount),
        redeemableAmount: formatCurrency(item?.market_value?.redeemable_amount),

      },
    });
  };



  if (!schemeData) {
    return (
      <View style={CommonStyles.container}>
        <CustomHeader title="Redeem" showBack={true} />
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          No scheme data found.
        </Text>
      </View>
    );
  }

  const {
    name,
    folio_number,
    holdings,
    invested_value,
    market_value,
    nav,
  } = schemeData;

  const units = holdings?.units ?? 0;
  const navValue = nav?.value ?? 0;
  const date = formatDate(nav?.as_on) ?? 0;
  const currentValue = market_value?.amount ?? 0;
  const investedValue = invested_value?.amount ?? 0;
  const redeemableAmount = market_value?.redeemable_amount ?? 0;

  const renderSchemeView = () => (
    <View>
      <Text allowFontScaling={false} style={styles.title}>{name}{schemeData?.isin ? ` (${schemeData?.isin})` : ''}</Text>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.label}>Last Recorded NAV</Text>
        <Text allowFontScaling={false} style={styles.label}>Value at NAV</Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>{date}</Text>
        <Text allowFontScaling={false} style={styles.value}>{formatCurrency(currentValue)}</Text>
      </View>
    </View>
  );

  const redeemBox = () => (
    <View style={CommonStyles.containerBox}>
      <Text allowFontScaling={false} style={styles.sectionTitle}>
        {folio_number ?? 'N/A'}
      </Text>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Available Units</Text>
        <Text allowFontScaling={false} style={styles.label}>Holding Mode</Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>{units}</Text>
        <Text allowFontScaling={false} style={styles.value}>PHYSICAL</Text>
      </View>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Value at Cost</Text>
        <Text allowFontScaling={false} style={styles.label}>Unrealized Profit/Loss</Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>{formatCurrency(investedValue)}</Text>
        <Text allowFontScaling={false} style={styles.value}>
          -
        </Text>
      </View>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        {/* <Text allowFontScaling={false} style={styles.label}>Capital Gain Status</Text> */}
        <Text allowFontScaling={false} style={styles.label}>Current Value</Text>
      </View>
      <View style={styles.detailRow}>
        {/* <Text
          allowFontScaling={false}
          style={styles.ViewText}
          onPress={() => navigation.navigate('CapitalGain')}
        >
          View
        </Text> */}
        <Text allowFontScaling={false} style={styles.value}>{formatCurrency(currentValue)}</Text>
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Redeem" showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSchemeView()}
        {redeemBox()}
        <View style={styles.btnRowss}>
          <CustomBackButton
            title="Back"
            onPress={() => navigation.goBack()}
          />
          <CustomButton
            title="Proceed"
            onPress={() => handleRedeemAmount(schemeData)}
            disabled={redeemableAmount === 0}
            buttonStyle={[
              styles.proceedBtn,
              redeemableAmount === 0 && { backgroundColor: Colors.lightggrey },
            ]}

          />
        </View>
      </ScrollView>
    </View>
  );
};

export default RedeemPage;


const styles = StyleSheet.create({

  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(6),
    width: responsiveWidth(75),
    alignSelf: 'center'
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.blue,
    width: '48%',
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.Semibold700,
    marginVertical: responsiveHeight(1.5),

  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(0.5)
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(0.3)
  },
  RowTopStyle: {
    marginTop: responsiveHeight(1)
  },
  label: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    width: responsiveWidth(35)
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.grey,
    width: responsiveWidth(35)
  },
  priceText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.black,
    marginBottom: responsiveHeight(1.5),
    marginTop: responsiveHeight(0.3)
  },
  scrollContent: {
    paddingBottom: responsiveHeight(13),
    paddingHorizontal: responsiveWidth(5),
  },
  ViewText: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.skyblue,
    textDecorationLine: 'underline'
  }
});
