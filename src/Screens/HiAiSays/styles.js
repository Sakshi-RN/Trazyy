import { StyleSheet, Platform } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
    scrollContent: {
        flex: 1,
        paddingBottom: responsiveHeight(13)
    },
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
    marketInfo: {
        backgroundColor: '#e6f3f0', // Light green/grey tint
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(4),
    },
    marketText: {
        fontSize: responsiveFontSize(1.8),
        color: '#333',
        fontWeight: '600',
    },
    marketPrice: {
        color: '#333',
    },
    marketChange: {
        color: '#16a34a', // Green
    },
    contentContainer: {
        flex: 1,
        top: responsiveHeight(-3)
    },
    headercontainer: {
        borderRadius: 25,
        height: Platform.OS === 'ios' ? responsiveHeight(30) : responsiveHeight(33),
        backgroundColor: Colors.white
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: responsiveWidth(4),
    },
    filterWrapper: {
        width: '48%',
    },
    filterLabel: {
        fontSize: 11,
        color: Colors.black,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#003366',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: responsiveHeight(0.5)
    },
    dropdownText: {
        fontSize: responsiveFontSize(1.8),
        color: '#333',
    },
    cardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingBottom: responsiveHeight(10),
    },
    gridItem: {
        width: '48%', 
        marginBottom: responsiveHeight(2),
    },
    cardContainer: {
        backgroundColor: 'transparent', 
        borderRadius: 10,
        overflow: 'hidden',
        height: responsiveHeight(25),
    },
    cardImage: {
        height: responsiveHeight(15),
        width: responsiveWidth(45)
    },
    blueContainerStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        width: responsiveWidth(45),
height:responsiveHeight(25),

    },

    cardTitle: {
        color: Colors.white,
        fontSize: 13,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),
        marginLeft: responsiveWidth(3),
        width: responsiveWidth(35),
    },
    cardDate: {
        color: Colors.white,
        fontSize: 10,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),
        marginLeft: responsiveWidth(3),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContent: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 10,
        padding: 20,
        maxHeight: responsiveHeight(50),
    },
    pickerItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pickerItemText: {
        fontSize: 16,
        color: Colors.blue,
        textAlign: 'center',
        fontFamily: Fonts.Medium600,
    },
});

export default styles;
