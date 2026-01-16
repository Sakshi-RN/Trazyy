import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { SecureImg } from '../../Assets/svg';
import CustomHeader from '../../Components/CustomHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonStyles } from '../../Themes/CommonStyles';
import InsuranceContainer from '../../Components/InsuranceContainer';


const Insurance = () => {

  const RenderportFolio = () => {
    return (
      <LinearGradient
        colors={['#9FD1FC', '#2b4e8cff']}
        style={styles.blueContainerStyle}>
        <View style={[styles.portfolioRow]}>
          <Text allowFontScaling={false} style={styles.portfolioText}>Protect what matters most. Secure your future with the right coverage.</Text>
          <SecureImg width={80} height={80} />
        </View>
      </LinearGradient>
    )
  }


  return (
    <View style={[CommonStyles.container, { paddingBottom: Platform.OS === "android" ? responsiveHeight(14) : responsiveHeight(11) }]}>
      <CustomHeader
        title="Insurance"
        showBack={true}
      />
      <ScrollView style={styles.scrollContent}>
        <RenderportFolio />
        <InsuranceContainer/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.black
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5)
  }
  ,
  blueContainerStyle: {
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
  },
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portfolioText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(55),
    lineHeight: 22
  },
  secureNowText: {
    color: Colors.newGreen,
    fontSize: 16,
    fontFamily: Fonts.Bold800,
    textDecorationLine: 'underline',
    marginTop: responsiveHeight(-3)
  },

});

export default Insurance;
