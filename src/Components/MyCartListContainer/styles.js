import {
  StyleSheet
} from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';


const styles = StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontSize: 18,
    marginTop: responsiveHeight(1),
    fontWeight: '500'
  },
  referralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  blueContainerStyle: {
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(5),
    borderColor: Colors.blue,
    borderWidth: 1.2
  },
  portfolioText: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(70),
    lineHeight: 24
  },
  secureNowText: {
    color: Colors.newGreen
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(6)
  },
  noDataText: {
    fontFamily: Fonts.Semibold700,
    fontSize: 16,
    color: Colors.blue,
    marginTop: responsiveHeight(2),
    alignSelf: 'center'
  },
  box: {
    paddingVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3)
  },
    emptyBtn: {
    alignItems: 'flex-end',
    marginTop: responsiveHeight(1.5),
    marginRight: responsiveWidth(6)
  },
    btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(6),
    marginHorizontal: responsiveWidth(6)
  },
    submitbtn: {
    paddingHorizontal: responsiveWidth(6),
    width: '50%'
  },
    scrollContent: {
    paddingBottom: responsiveHeight(2),
    height: responsiveHeight(57),
  },
    btnText: {
    fontSize: 13,
    fontFamily: Fonts.Semibold700,
  },
});

export default styles;
