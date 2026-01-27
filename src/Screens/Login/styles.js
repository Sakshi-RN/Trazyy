import { StyleSheet, Platform } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        alignItems: 'center',
      bottom: responsiveHeight(-5),
    },
    illustration: {
        width: responsiveWidth(90),
        height: responsiveHeight(35),
        marginTop: responsiveHeight(1),
    },
    gradientCard: {
        width: '100%',
        minHeight: responsiveHeight(52),
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: responsiveWidth(6),
        paddingTop: responsiveHeight(4),
    },
    formContent: {
        // alignItems: 'center',
    },
    titleText: {
        fontSize: 28,
        fontFamily: Fonts.Bold800,
        color: Colors.white,
        marginBottom: responsiveHeight(1),
        textAlign: 'center',
        fontWeight: 'bold'
    },
    subtitleText: {
        fontSize: 14,
        fontFamily: Fonts.Medium600,
        color: Colors.white,
        textAlign: 'center',

    },
    glassInput: {
        marginTop: responsiveHeight(2.5),
        paddingVertical: Platform.OS === 'ios' ? responsiveHeight(1.5) : responsiveHeight(0.2),
    },

    glassButton: {
        marginTop: responsiveHeight(2),
        alignSelf: 'center',

    },
    footerSection: {
        marginTop: responsiveHeight(2),
        alignItems: 'center',

    },
    futureText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.Medium600,
    },
    createAccountText: {
        fontSize: 13,
        color: Colors.Light_skyBlue,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(0.5),
    },
    errorText: {
        color: Colors.blue,
        fontSize: 13,
        marginLeft: responsiveWidth(4),
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
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
        color: Colors.red,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),
        fontSize: 15,
    },
});

export default styles;
