import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomHeader from '../../Components/CustomHeader';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo';
import PrivacyPolicy from '../../Assets/svg/PrivacyPolicy.svg';
import TermsCondition from '../../Assets/svg/TermsCondition.svg';
import * as WebBrowser from 'expo-web-browser';

const AboutUsPage = () => {


  const goToRerms = () => {
    navigation.navigate('AsperoWebView', {
      url: 'https://investek.in/terms-of-uses/',
    });
  };
  const goToPrivacy = () => {
    navigation.navigate('AsperoWebView', {
      url: 'https://investek.in/privacy-policy/',
    });
  };
  const goAboutPage = () => {
    navigation.navigate('AsperoWebView', {
      url: 'https://investek.in/about-us/',
    });
  };


  const Section = ({ data }) => (
    <View style={[CommonStyles.containerBox, { marginTop: responsiveHeight(2) }]}>
      {data.map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.option} onPress={item.onPress}>
          <View style={styles.iconWrapper}>{item.icon}</View>
          <Text allowFontScaling={false} style={styles.optionText}>{item.title}</Text>
          <Entypo name="chevron-right" size={24} color={Colors.black} />
        </TouchableOpacity>
      ))}
    </View>

  );

  const renderAboutUText = () => {
    return (
      <View style={CommonStyles.containerBox}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          InvesTek was founded with a clear vision to revolutionize the approach to Financial Markets. Our goal is to become a powerhouse of financial expertise.
        </Text>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          Our team consists of experienced professionals from diverse financial domains, carrying domestic and International markets. They have been groomed and trained in best of the organisations like Morgan Stanley, HSBC, Citibank, Standard Chartered, IndusInd, HDFC Bank and IDFC First Bank.
        </Text>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          At InvesTek, we prioritize creating value for both our clients and employees, while upholding principles of excellence and trust. Our investment philosophy plays a great importance on protecting against downside risks and meticulously managing costs and taxes to minimize their impact.
        </Text>
        <TouchableOpacity onPress={goAboutPage}>
          <Text allowFontScaling={false} style={styles.message}>View More</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="About InvesTek" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} >
        {renderAboutUText()}
        <Section
          data={[
            {
              title: 'Privacy Policy',
              icon: <PrivacyPolicy />,
              onPress: goToPrivacy,
            },
            {
              title: 'Terms & Conditions',
              icon: <TermsCondition />,
              onPress: goToRerms,
            },


          ]}
        />
      </ScrollView>
    </View>

  );
};

export default AboutUsPage;

const styles = StyleSheet.create({
  message: {
    fontSize: 13,
    color: Colors.skyblue,
    fontFamily: Fonts.Semibold700,
    textDecorationLine: 'underline',
    marginVertical: responsiveHeight(1)
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.2),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightggrey
  },
  iconWrapper: {
    marginRight: responsiveWidth(4),
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? responsiveHeight(13) : responsiveHeight(16),
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2)
  },
  sectionTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.Medium600,
    color: Colors.black,
    marginTop: responsiveHeight(2),
  },

  optionText: {
    fontSize: 15,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(65),

  },
});
