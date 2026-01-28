import { StyleSheet,Platform } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? responsiveHeight(5) : responsiveHeight(7),
    },
    headercontainer: {
        backgroundColor: Colors.white,
        paddingBottom: responsiveHeight(1),
        borderRadius: 25,
        height: Platform.OS === 'ios' ? responsiveHeight(24) : responsiveHeight(26),
        zIndex: 1,
        elevation: 1,
        position: 'relative',


    },
    marketStrip: {
        backgroundColor: '#e0f7fa',
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(4),
        marginBottom: responsiveHeight(1),
    },
    marketText: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'bold',
    },
    greenText: {
        color: 'green',
    },
    blueBadge: {
        backgroundColor: '#0288d1',
        color: 'white',
        paddingHorizontal: 4,
        borderRadius: 4,
        fontSize: 10,
        overflow: 'hidden',
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(2)
    },
    modulesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: responsiveHeight(0.4),
        width: responsiveWidth(40),
        borderWidth: 0.5,
        borderColor: Colors.Gray
    },
    searchInput: {
        flex: 1,
        marginLeft: 5,
        fontSize: 12,
        color: '#333',
        padding: 0,
    },
    contentScroll: {
        flex: 1,
        top: responsiveHeight(-1),

    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingBottom: responsiveHeight(5),

    },
    cardContainer: {
        width: responsiveWidth(44),
        marginBottom: responsiveHeight(2),
        borderRadius: 10,
        paddingVertical: responsiveHeight(5),
        borderWidth: 0.5,
        borderColor: Colors.white,
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: responsiveWidth(2),

    },
    cardGradient: {
        padding: 10,
        height: responsiveHeight(25),
        justifyContent: 'space-between',
        borderRadius: 10
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    numberBox: {
        width: 30,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: Colors.lightPurple
    },
    numberText: {
        fontFamily: Fonts.Semibold700,
        fontSize: 18,
        color: Colors.purple,
    },
    cardTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        flexWrap: 'wrap'
    },
    chapterText: {
        fontSize: 10,
        color: '#f0f0f0',
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 9,
        color: '#e0e0e0',
        lineHeight: 12,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(1)
    },
    linkText: {
        fontSize: 9,
        color: Colors.yellow,
        fontFamily: Fonts.Semibold700
    },
    viewMoreButton: {
        alignSelf: 'center',
borderWidth:1,
borderColor:Colors.blue,
borderRadius:12,
height:responsiveWidth(10),
paddingHorizontal:responsiveWidth(6),
justifyContent:'center',
alignItems:'center',
margibBottom:responsiveHeight(2)

    },
    viewMoreText: {
       color: Colors.blue,
      fontSize: 14,
      fontFamily: Fonts.Medium600,
    },
});

export default styles;
