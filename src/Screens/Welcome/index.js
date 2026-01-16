import { View, Text, StyleSheet, Platform } from 'react-native';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import { Logo, WelcomeImg } from '../../Assets/svg';
import { useNavigation } from '@react-navigation/native';


const Welcome = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <Logo />
      <WelcomeImg />
      <Text allowFontScaling={false} style={styles.skipText} >Grow Your Money</Text>
      <Text allowFontScaling={false} style={styles.footerText} >Achieve your long term financial{'\n'}goals with InvesTek.</Text>
      <CustomButton
        title={'Continue'}
        buttonStyle={styles.buttonStyle}
        onPress={handleNext}
      />
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: responsiveHeight(8),
    backgroundColor: Colors.white
  },

  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(65),
    marginTop: responsiveHeight(2)
  },

  buttonStyle: {
    marginTop: responsiveHeight(2.5),
  },
  skipText: {
    marginTop: responsiveHeight(1.5),
    color: Colors.black,
    fontFamily: Fonts.Bold800,
    fontSize: 28,
    fontWeight: 'bold'
  },

  footerText: {
    marginTop: responsiveHeight(1.5),
    color: Colors.black,
    fontFamily: Fonts.Bold800,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 18
  },
});
