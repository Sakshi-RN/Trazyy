import {
  StyleSheet
} from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(4),

  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  inputWidth: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
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
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700,
  },
  valuesText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },
  schemeText: {
    color: Colors.grey,
    fontSize: 10,
    fontFamily: Fonts.Semibold700
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  inputViewStyle: {
    borderColor: Colors.lightgrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
    width: '47%',

  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  label: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disableEmailTextColor: {
    color: Colors.grey
  }
});

export default styles;
