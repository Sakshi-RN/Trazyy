import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: responsiveHeight(8),
        backgroundColor: Colors.white
    },
    imageBackgroundStyle: {
        width:responsiveWidth(95),
        height:responsiveHeight(92),
        top:responsiveHeight(-12)
    },
    logo:{
        alignSelf:'center',
        marginTop: responsiveHeight(2),
    },

    headingText: {
        alignSelf: 'center',
    },
    welcomeText: {
        fontSize: 20,
        color: Colors.blue,
        fontFamily: Fonts.Bold800,
        marginVertical: responsiveHeight(2),
        alignSelf: 'center',
    },
    futureText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.Medium600,
        alignSelf: 'center'
    },
    btn: {
        marginVertical: responsiveHeight(2),
        alignSelf:'center'
    },
    signInBtn: {
        color: Colors.Light_skyBlue,
        fontFamily: Fonts.Semibold700,
        fontSize: 13,
        alignSelf: 'center',
        marginTop: responsiveHeight(0.2),

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
        fontFamily: Fonts.Medium600,
    },
    circle: {
        marginHorizontal: responsiveWidth(3),
    },

    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
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
        paddingHorizontal: responsiveWidth(2),
    },
    btncallingRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    ForgotPssText: {
        color: Colors.blue,
        fontSize: 15,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
        alignSelf: 'flex-end'
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
