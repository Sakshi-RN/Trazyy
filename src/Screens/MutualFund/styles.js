import { StyleSheet} from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,

  },

  prflNameText: {
    fontSize: 20,
    marginTop: responsiveHeight(2.5),
    fontFamily: Fonts.Bold800,
    color: Colors.white,
    marginLeft: responsiveWidth(5),
    width: responsiveWidth(80),
    lineHeight: 23,
    marginBottom: responsiveHeight(1)
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.Semibold700,
    color: Colors.blue
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(1)
  },
  scrollContent:
    { paddingHorizontal: responsiveWidth(5) }
  ,

  portfolioRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    justifyContent: 'space-between'
  },

  viewAll: {
    color: Colors.skyblue,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Fonts.Medium600,
    textDecorationLine: 'underline'
  },

  nameText: {
    fontSize: 16,
    fontFamily: Fonts.Medium600,
    color: Colors.black
  },
  newRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.8),
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1.3
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(7),
    marginBottom: responsiveHeight(2)
  },
});

export default styles;
