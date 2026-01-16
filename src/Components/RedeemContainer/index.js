import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../../utils/formatCurrency';


const RedeemContainer = ({ isVisible, onClose, schemeData }) => {
    const navigation = useNavigation();
    if (!schemeData) return null;

    const { name, type, holdings, invested_value, nav, market_value, fund_category, investment_option, min_initial_investment, max_initial_investment, frequencies } = schemeData;

    const units = holdings?.units || 0;
    const redeemableUnits = holdings?.redeemable_units || 0;
    const investedAmount = invested_value?.amount || 0;
    const redeemableAmount = market_value?.redeemable_amount || 0;
    const latestNav = nav?.value || 0;



    const handleNavigation = (btn) => {
        onClose();
        setTimeout(() => {
            switch (btn) {
                case 'SIP':
                    navigation.navigate('SIPFirstForm', {
                        existingFolio: {
                            number: schemeData.folio_number || schemeData.folioNumber,
                            amc_id: schemeData?.amc_id,
                            amc_name: schemeData?.amc_name,
                            fund_scheme_name: name,
                            isin: schemeData?.isin,
                            fund_category,
                            investment_option,
                            frequencies
                        }
                    });
                    break;
                case 'LUMPSUM':
                    navigation.navigate('OneTimeFirstForm', {
                        existingFolio: {
                            number: schemeData.folio_number || schemeData.folioNumber,
                            amc_id: schemeData?.amc_id,
                            amc_name: schemeData?.amc_name,
                            fund_scheme_name: name,
                            isin: schemeData?.isin,
                            fund_category,
                            investment_option,
                            min_initial_investment: schemeData.min_initial_investment,
                            max_initial_investment: schemeData.max_initial_investment,
                        }
                    });
                    break;
                case 'REDEEM':
                    navigation.navigate('RedeemPage', { schemeData });
                    break;
                default:
                    break;
            }
        }, 300);
    };



    return (
        <Modal
            transparent
            animationType="slide"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                <TouchableOpacity style={styles.backdropArea} activeOpacity={1} onPress={onClose} />
                <View style={styles.sheetContainer}>
                    <View style={styles.dragHandle} />
                    <ScrollView>
                        <Text allowFontScaling={false} style={styles.title}>{name}{schemeData?.isin ? ` (${schemeData?.isin})` : ''}</Text>
                        <View style={styles.tagContainer}>
                            <Text allowFontScaling={false} style={styles.tagGray}>{fund_category}</Text>
                            <Text allowFontScaling={false} style={styles.tagGray}>{investment_option}</Text>
                        </View>
                        <View style={styles.actionRow}>
                            {['SIP', 'LUMPSUM', 'REDEEM'].map((btn, i) => (
                                <TouchableOpacity
                                    onPress={() => handleNavigation(btn)}
                                    key={i}
                                    style={[styles.actionButton, btn === 'SIP' && styles.activeButton]}
                                >
                                    <Text allowFontScaling={false} style={[styles.actionText, btn === 'SIP' && styles.activeText]}>{btn}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text allowFontScaling={false} style={styles.sectionTitle}>Holding Details</Text>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Units</Text>
                            <Text allowFontScaling={false} style={styles.value}>{units}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Rating</Text>
                            <Text allowFontScaling={false} style={styles.value}>-</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Redeemable Units (ELSS)</Text>
                            <Text allowFontScaling={false} style={styles.value}>{redeemableUnits}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Average Cost</Text>
                            <Text allowFontScaling={false} style={styles.value}>-</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Latest NAV</Text>
                            <Text allowFontScaling={false} style={styles.value}>{formatCurrency(latestNav)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Redeemable Amount</Text>
                            <Text allowFontScaling={false} style={styles.value}>{formatCurrency(redeemableAmount)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text allowFontScaling={false} style={styles.label}>Invested Amount</Text>
                            <Text allowFontScaling={false} style={styles.value}>{formatCurrency(investedAmount)}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default RedeemContainer;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    backdropArea: {
        flex: 1,
    },
    sheetContainer: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: responsiveWidth(5),
        paddingBottom: responsiveHeight(5),
        paddingTop: responsiveHeight(1)
    },
    dragHandle: {
        width: responsiveWidth(45),
        height: responsiveHeight(0.3),
        backgroundColor: Colors.LIGHTGREY,
        borderRadius: 3,
        alignSelf: 'center'
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1.5),
    },
    tagContainer: {
        flexDirection: 'row',
        marginTop: responsiveHeight(1),
    },
    tagGray: {
        backgroundColor: Colors.lightggrey,
        color: Colors.Gray,
        fontSize: 11,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(0.2),
        borderRadius: 4,
        marginRight: 5,
        fontFamily: Fonts.Semibold700
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: responsiveHeight(1.5),
        alignItems: 'center'
    },
    actionButton: {
        borderWidth: 1,
        borderColor: Colors.newPurple,
        paddingVertical: responsiveHeight(0.6),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: 3,
        marginRight: responsiveWidth(3),
    },
    actionText: {
        color: Colors.black,
        fontSize: 12,
        fontFamily: Fonts.Medium600
    },
    activeButton: {
        backgroundColor: Colors.newPurple,
    },
    activeText: {
        color: Colors.white,
    },
    sectionTitle: {
        fontSize: 15,
        fontFamily: Fonts.Bold800,
        marginTop: responsiveHeight(1.5)
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1.2)
    },
    label: {
        color: Colors.black,
        fontSize: 13,
        fontFamily: Fonts.Semibold700

    },
    value: {
        fontSize: 14,
        fontFamily: Fonts.Semibold700,
        color: Colors.grey,
    },
});
