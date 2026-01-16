import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: responsiveHeight(10),
         paddingHorizontal: responsiveWidth(5),
         backgroundColor:Colors.white
    },

    headingText: {
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize:20,
        color: Colors.blue,
        fontFamily:Fonts.Bold800,
        marginTop: responsiveHeight(2),
        alignSelf: 'center',
    },
    futureText: {
        fontSize:13,
        color: Colors.black,
         fontFamily:Fonts.Semibold700,
    },
    btn: {
        marginVertical: responsiveHeight(3),
    },
    signInBtn: {
        color: Colors.blue,
       fontFamily:Fonts.Bold800,
        fontSize:13,
    },
    callingText: {
        fontSize: 16,
        color: Colors.blue,
        fontFamily:Fonts.Medium600,
        marginVertical:responsiveHeight(1)
    },

    errorText: {
        color: Colors.red,
        fontSize:12,
        marginTop: responsiveHeight(1),
        fontFamily:Fonts.Semibold700,
    },

    row: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal:responsiveWidth(2),    
    },

    rowContainer:{
         alignItems: 'center',
        flexDirection: 'row',
    },
    iconStyle:{
        alignSelf:'center',
        width:responsiveWidth(25)
    },
  footer: {
    position: 'absolute',
    bottom: responsiveHeight(5), 
    width: '100%',
    alignItems: 'center',
             alignSelf:'center'


  }

});
export default styles;
