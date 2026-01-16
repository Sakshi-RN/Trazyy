import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { CommonStyles } from '../../Themes/CommonStyles';


const OrderPageCard = ({
  icon,          
  name,          
  PurchaseStatus,
  excutedStatus,
  purchaseDate,
  purchaseAmount
}) => {



  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return dateString; 
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options); 
  };


  const capitalizeFirstLetter = (str) => {
  if (!str) return "N/A";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

  return (
<View style={CommonStyles.containerBox}>
  <View style={styles.badgesRow}>
    <Text allowFontScaling={false} style={styles.schemeName}>{name}</Text>
    <Text allowFontScaling={false} style={styles.purchaseAmountStyle}>
       {purchaseAmount}
      </Text>
  </View>

  <View style={styles.footerRow}>
    <View style={styles.footerItem}>
      <Text allowFontScaling={false} style={[styles.label, { color: Colors.newOrange }]}>
        {capitalizeFirstLetter(PurchaseStatus)}
      </Text>
    </View>

    <View style={styles.footerItem}>
      <Text allowFontScaling={false} style={styles.label}>
        {formatDate(purchaseDate)}
      </Text>
    </View>

    <View style={styles.footerItem}>
      <Text allowFontScaling={false} style={[styles.label, { color: Colors.green }]}>
        {capitalizeFirstLetter(excutedStatus)}
      </Text>
    </View>
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1.5),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: responsiveWidth(12),
    height: responsiveWidth(12)
  },
  schemeName: {
    fontSize: 12,
    fontFamily: Fonts.Bold800,
    color: Colors.black,
    width: responsiveWidth(60)
  },
  purchaseAmountStyle: {
    fontSize: 14,
    fontFamily: Fonts.Semibold700,
    color: Colors.grey,
  },
  // badgesRow: {
  //   flexDirection: 'row',
  //   marginTop: responsiveHeight(1),
  //   justifyContent: 'space-between'
  // },
  badge: {
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: 2,
    marginRight: responsiveWidth(2)
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.Semibold700,
    color: Colors.lightblue
  },
  // footerRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginTop: responsiveHeight(1.5)
  // },
  // label: {
  //   fontSize: 12,
  //   color: Colors.grey,
  //   fontFamily: Fonts.Semibold700
  // },
  value: {
    fontSize: 13,
    fontFamily: Fonts.Bold800,
    color: Colors.black
  },
  badgesRow: {
  flexDirection: 'row',
  marginTop: responsiveHeight(1),
  justifyContent: 'space-between'
},

footerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: responsiveHeight(1.5)
},

footerItem: {
  flex: 1,
  alignItems: 'center'
},

label: {
  fontSize: 12,
  color: Colors.grey,
  fontFamily: Fonts.Semibold700,
},

});

export default OrderPageCard;
