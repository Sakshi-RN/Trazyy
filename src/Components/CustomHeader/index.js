import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Logo } from '../../Assets/svg';
import { Fonts } from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import { useCartCounts } from '../../utils/CartCountContext';

const CustomHeader = ({
  title,
  showBack = false,
  showLogo = false
}) => {
  const navigation = useNavigation();
  const { sipCount, lumpsumCount } = useCartCounts();
const totalCount = sipCount + lumpsumCount;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCart = () => {
    navigation.navigate('MyCart');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.sideContainer}>
        {showBack && (
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color={Colors.blue} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {showLogo ? (
          <Logo height={40} width={130} />
        ) : (
          <Text allowFontScaling={false} style={styles.title}>{title}</Text>
        )}
      </View>

      <View style={styles.sideContainer}>
        <TouchableOpacity onPress={handleCart}>
          <Ionicons name="cart-outline" size={25} color={Colors.blue} />
        </TouchableOpacity>
        {totalCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalCount}</Text>
          </View>
            )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    height: responsiveHeight(7),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: responsiveHeight(5)
  },
  sideContainer: {
    width: 40,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily:Fonts.Semibold700,
    color:Colors.blue,
  },
  logo: {
    height: 30,
    width: 100,
  },
   cartBadge: {
    position: 'absolute',
    top: -5,
    right: responsiveWidth(-1),
    backgroundColor: Colors.red,
    borderRadius:9,
    width:18,
    height:18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily:Fonts.Semibold700,
  },
});

export default CustomHeader;

