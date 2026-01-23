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
  showLogo = false,
  showNotification = false,
  onNotificationPress
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.blue} />
          </TouchableOpacity>
        ) : showLogo ? (
          <Logo width={100} height={30} />
        ) : null}
      </View>

      <View style={styles.centerContainer}>
        {title && <Text allowFontScaling={false} style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.blue} />
            {/* Badge example, if needed passed as prop later */}
            {/* <View style={styles.badge} /> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: responsiveHeight(5) // Adjust based on safe area or need
  },
  leftContainer: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.Semibold700,
    color: Colors.blue, // Using Colors.blue based on previous file
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  notificationButton: {
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default CustomHeader;

