import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
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
        marginVertical: responsiveHeight(2),
        alignSelf: 'center',
    },
    futureText: {
        fontSize:13,
        color: Colors.black,
         fontFamily:Fonts.Semibold700
    },
    btn: {
        marginVertical: responsiveHeight(3),
    },
    signInBtn: {
        color: Colors.blue,
       fontFamily:Fonts.Bold800,
        fontSize:13,
    },
    line: {
        backgroundColor: Colors.blue,
        height: 2,
        marginVertical: responsiveHeight(2.5),
        width: '100%',
    },
  
    callingText: {
        fontSize: 14,
        color: Colors.blue,
        fontFamily:Fonts.Medium600,
    },
    circle: {
        marginHorizontal:responsiveWidth(3),
    },

    errorText: {
        color: Colors.red,
        fontSize:12,
        marginTop: responsiveHeight(1),
        fontFamily:Fonts.Semibold700,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.transparent
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal:responsiveWidth(2),    
    },
    btncallingRow:{
        alignItems: 'center',
        flexDirection: 'row',  
    },
    ForgotPssText:{
 color: Colors.blue,
        fontSize:15,
        marginTop: responsiveHeight(1),
        fontFamily:Fonts.Semibold700,
        alignSelf:'flex-end'
    },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },

    modalMessage: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: responsiveHeight(2),
        color: Colors.black,
        fontFamily: Fonts.Semibold700,
    },
    cancelText: {
        color: Colors.red, fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),
        fontSize: 15,
    },



});
export default styles;
