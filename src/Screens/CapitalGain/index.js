import { View, StyleSheet, ScrollView, Text } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { formatCurrency } from '../../utils/formatCurrency';


const CapitalGain = () => {

  const renderSchemeView = () => (
    <View style={CommonStyles.containerBox}>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={[styles.label, styles.textWidth]}>Total Units</Text>
        <Text allowFontScaling={false} style={[styles.label, styles.textWidth]}>
          Long Term Units
        </Text>
        <Text allowFontScaling={false} style={[styles.label, styles.textWidth]}>
          Short Term Units
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={[styles.value, styles.textWidth]}>
          142484902
        </Text>
        <Text allowFontScaling={false} style={[styles.value, styles.textWidth]}>
          142484902
        </Text>
        <Text allowFontScaling={false} style={[styles.value, styles.textWidth]}>
          142484902
        </Text>
      </View>
    </View>
  );

  const redeemBox = () => (
    <View style={CommonStyles.containerBox}>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Fund Name</Text>
        <Text allowFontScaling={false} style={styles.label}>
          Transaction ID
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>SBI Contra Fund -  Regular Plan - Growth</Text>
        <Text allowFontScaling={false} style={styles.value}>
          142484902
        </Text>
      </View>

      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Amount (Rs.)</Text>
        <Text allowFontScaling={false} style={styles.label}>
          Transaction Type
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>15000</Text>
        <Text allowFontScaling={false} style={styles.value}>
          Purchase
        </Text>
      </View>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Date</Text>
        <Text allowFontScaling={false} style={styles.label}>
          Latest Recorded NAV
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>06-Mar-2023</Text>
        <Text allowFontScaling={false} style={styles.value}>
          65.1540
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}></Text>
        <Text allowFontScaling={false} style={styles.value}>06-Mar-2023</Text>
      </View>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Unit(s)</Text>
        <Text allowFontScaling={false} style={styles.label}>
          Days left for LTCG#
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>06-Mar-2023</Text>
        <Text allowFontScaling={false} style={styles.value}>
          65.1540
        </Text>
      </View>
      <View style={[styles.detailRow, styles.RowTopStyle]}>
        <Text allowFontScaling={false} style={styles.label}>Long Terms Unit(s) for capital gain</Text>
        <Text allowFontScaling={false} style={styles.label}>
          Short Terms Unit(s) for capital gain
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text allowFontScaling={false} style={styles.value}>06-Mar-2023</Text>
        <Text allowFontScaling={false} style={styles.value}>
          65.1540
        </Text>
      </View>
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Capital Gain Status" showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSchemeView()}
        {redeemBox()}
      </ScrollView>
    </View>
  );
};

export default CapitalGain;

const styles = StyleSheet.create({

  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    fontSize: 13.5,
    fontFamily: Fonts.Medium600,
    width: responsiveWidth(35)
  },
  value: {
    fontSize: 13.5,
    fontFamily: Fonts.Medium600,
    color: Colors.grey,
    width: responsiveWidth(35),
  },
  textWidth: {
    width: responsiveWidth(25)
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
    paddingTop:responsiveHeight(2)
  },

});
