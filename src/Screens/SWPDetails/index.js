import {
  View, StyleSheet, ScrollView,
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPFirstprogress } from '../../Assets/svg';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import CustomBackButton from '../../Components/CustomBackButton';

const SWPDetails = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate("SIPNewForm");
  };

  const renderSchemeView = () => (
    <View>
      <Text allowFontScaling={false} style={styles.title}>SBI Contra Fund - Regular Plan - Growth</Text>
      <Text allowFontScaling={false} style={styles.label}>Last Recorded NAV</Text>
      <Text allowFontScaling={false} style={styles.value}>₹374.8081 as on 06-Aug-2025</Text>
      <Text allowFontScaling={false} style={styles.label}>Value at NAV</Text>
      <Text allowFontScaling={false} style={styles.value}>₹24,420.25</Text>
      <Text allowFontScaling={false} style={styles.label}>Folio No.</Text>
      <Text allowFontScaling={false} style={styles.value}>XZ1234095233324</Text>
      <Text allowFontScaling={false} style={styles.label}>Scheme Option</Text>
      <Text allowFontScaling={false} style={styles.value}>Growth</Text>
    </View>
  );

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(12) }]}>
      <CustomHeader title="Systematic Withdrawal Plan" showBack={true} />
      <SIPFirstprogress style={styles.progressbarStyle} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
        {renderSchemeView()}
        <View style={styles.btnRowss}>
          <CustomBackButton title="Cancel" onPress={() => navigation.goBack()} />
          <CustomButton buttonStyle={styles.submitbtn} textStyle={styles.submtText} title="Next" onPress={handleNext} />
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(3),
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginVertical: responsiveHeight(2)
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '48%',
  },
  submitbtn: {
    width: '48%',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
    marginTop: responsiveHeight(1),

  },
  label: {
    color: Colors.grey,
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    marginTop: responsiveHeight(1)
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.black,
    marginTop: responsiveHeight(0.2)
  }

});

export default SWPDetails;
