import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { CommonStyles } from '../../Themes/CommonStyles';
import { formatCurrency } from '../../utils/formatCurrency';

const SchemeCard = ({
  name,
  category,
  invested,
  currentValue,
  xirrr,
  onBuyMorePress,
  folioNumber,
  ISISN
}) => {



  return (
    <View>
      {folioNumber &&
        <Text allowFontScaling={false} style={styles.folioNumberText}>
          Folio Number - {folioNumber}
        </Text>}
      <View style={[CommonStyles.containerBox, styles.card]}>
        <View style={styles.headerRow}>
          <Text allowFontScaling={false} style={styles.schemeName}>{name}{ISISN ? ` (${ISISN})` : ''}</Text>
          <TouchableOpacity
            style={styles.newTransactionBtn}
            onPress={onBuyMorePress}
          >
            <Text allowFontScaling={false} style={styles.newTransactionBtnText}>New Transaction</Text>
          </TouchableOpacity>
          <View>
          </View>
        </View>
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text allowFontScaling={false} style={styles.badgeText}>{category}</Text>
          </View>
        </View>
        <View style={styles.footerRow}>
          <View>
            <Text allowFontScaling={false} style={styles.label}>Current Value</Text>
            <Text allowFontScaling={false} style={styles.value}>{formatCurrency(currentValue)}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.label}>Invested</Text>
            <Text allowFontScaling={false} style={styles.value}>{formatCurrency(invested)}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.label}>XIRR</Text>
            <Text allowFontScaling={false} style={[styles.value, { color: Colors.green }]}>{xirrr}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    marginTop: responsiveHeight(1.5)
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  schemeName: {
    fontSize: 12,
    fontFamily: Fonts.Bold800,
    color: Colors.black,
    width: responsiveWidth(60),
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1)
  },
  badge: {
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: 12,
    backgroundColor: Colors.lightggrey
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.Semibold700,
    color: Colors.grey,
  },
  newTransactionBtn: {
    paddingHorizontal: responsiveWidth(2.3),
    height: responsiveHeight(2.5),
    borderRadius: 4,
    backgroundColor: Colors.GREEN,
    justifyContent: 'center'
  },

  newTransactionBtnText: {
    fontSize: 10,
    fontFamily: Fonts.Semibold700,
    color: Colors.newGreen,

  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1.5)
  },
  label: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Medium600
  },
  value: {
    fontSize: 13,
    fontFamily: Fonts.Bold800,
    color: Colors.black
  },
  folioNumberText: {
    fontSize: 13,
    fontFamily: Fonts.Bold800,
    color: Colors.blue,
    marginTop: responsiveHeight(1)
  },
});

export default SchemeCard;
