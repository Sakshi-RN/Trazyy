import { View, Text, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../CustomButton';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native'
import { ReferalGroup, InvesTekRow } from '../../Assets/svg';
import * as WebBrowser from 'expo-web-browser';

const ReferralBox = () => {

  const navigation = useNavigation();

  const goToReferralDetails = () => {
    navigation.navigate('AddReferralDetails');
  };
      const goToRerms = () => {
    WebBrowser.openBrowserAsync('https://investek.in/rrp-termsof-use/')
      };

  return (
    <View style={styles.scrollContentStyle}>
      <View style={[CommonStyles.containerBox, {alignItems: 'center',paddingHorizontal: responsiveWidth(12) }]}>
        <ReferalGroup />
        <Text allowFontScaling={false} style={styles.message}>
          Refer 5 friends & earn
        </Text>
        <Text allowFontScaling={false} style={styles.title}>
          ₹2000
        </Text>
      </View>
  <Text allowFontScaling={false} style={styles.termsText} onPress={() => WebBrowser.openBrowserAsync('https://investek.in/terms-of-uses/')}>Terms of Use</Text>
      
      {/* <Text allowFontScaling={false} style={styles.stepsText}>
        3 SIMPLE STEPS
      </Text>
      <InvesTekRow /> */}
      <CustomButton
        buttonStyle={styles.btnRowss}
        title="Refer Now"
        onPress={goToReferralDetails}
      />
    </View>

  );
};

export default ReferralBox;

const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    paddingBottom: responsiveHeight(4)

  },
  stepsText: {
    fontSize: 15,
    color: Colors.DARKGREY,
    fontFamily: Fonts.Bold800,
    marginVertical: responsiveHeight(1.5),
  },
  title: {
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    color: Colors.newGreen,
  },
  message: {
    fontSize: 15,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700
  },
  btnRowss: {
    alignSelf: 'center',
    marginTop: responsiveHeight(2.5)
  },

  submitbtn: {
    width: responsiveWidth(45)
  },
  submitText: {
    fontSize: 15,
    fontFamily: Fonts.Semibold700
  },
      termsText: {
        color: Colors.skyblue,
        textDecorationLine: 'underline',
            fontSize: 15,
    fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1)
    },
});
