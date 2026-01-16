import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../Components/Loader';
import CustomHeader from '../../Components/CustomHeader';
import CustomButton from '../../Components/CustomButton';

import { CommonStyles } from '../../Themes/CommonStyles';
import { Fonts } from '../../Themes/Fonts';
import ReferralBox from '../../Components/ReferralBox';
import getEnvVars from '../../utils/config';

const ReferralList = () => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalReferralPoints, setTotalReferralPoints] = useState(0);
    const [noData, setNoData] = useState(false);


    useEffect(() => {
        const fetchReferralData = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    Alert.alert('Error', 'No token found');
                    return;
                }
                const response = await fetch(`${baseURL}${endpoints.GET_REFERRAL_ALL}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (data.status && data.response && data.response.length > 0) {
                    setReferrals(data.response);
                    const allInteractions = data.response.flatMap(referral => referral.interactionDetails);
                    setTotalCount(data.totalCount);
                    setTotalReferralPoints(data.totalReferralPoints);
                    setNoData(false);  // ✅ now works
                } else {
                    setNoData(true);   // ✅ now works
                }
            } catch (error) {
                console.error('Fetch referral data error:', error);
                Alert.alert('Error', 'Failed to fetch referral data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReferralData();
    }, []);


    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{5})(\d{5})$/);
        if (match) {
            return `+91 ${match[1]} ${match[2]}`;
        }
        return `+91 ${phoneNumber}`;
    };

    const goToReferralDetails = () => {
        navigation.navigate('AddReferralDetails');
    };

    const renderReferralItem = ({ item }) => {
        const formatDateTime = (dateString) => {
            const date = new Date(dateString);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12; // 0 → 12

            const time = `${hours}:${minutes} ${ampm}`;

            return `${day}/${month}/${year}  ${time}`;
        };

        const formattedDate = formatDateTime(item.created_date);
        return (
            <TouchableOpacity style={CommonStyles.containerBox}
                onPress={() => navigation.navigate('InteractionDetails', {
                    clientId: item.clientId,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    interactionDetails: item.interactionDetails || [],
                    email: item.email,
                    phoneNumber: item.phone,
                    points: item.points,
                    status: item.status,
                    created_date: item.created_date,

                })}>
                <View style={styles.rowStyle}>
                    <Text allowFontScaling={false} style={styles.referralName}>
                        {item.firstname
                            ? item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)
                            : 'N/A'}
                        {' '}
                        {item.lastname
                            ? item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)
                            : ''}
                    </Text>
                    <Text allowFontScaling={false} style={styles.referralPoints}>{item?.points || '0'}</Text>
                </View>
                <View>
                    <Text allowFontScaling={false} style={styles.referralDate}>{formattedDate || 'N/A'}</Text>
                    <Text allowFontScaling={false} style={styles.referralDate}>{formatPhoneNumber(item.phone)}</Text>
                    <Text allowFontScaling={false} style={styles.referralDate}>{item?.email || 'N/A'}</Text>
                </View>

            </TouchableOpacity>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerLogo}>
                    <Loader />
                </View>
            );
        }

        return (
            <FlatList
                data={referrals}
                renderItem={renderReferralItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
                contentContainerStyle={styles.scrollContent}
            />
        );
    };
    const capitalizeFirstLetter = (str) => {
        if (!str || typeof str !== "string") return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    const renderAddReferralContainer = () => {
        return (
            <View style={styles.row}>
                <LinearGradient
                    colors={['#9FD1FC', '#002972']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.blueContainerStyle}
                >
                    <Text allowFontScaling={false} style={styles.portfolioAmount}>{totalCount || '0'} Referral</Text>
                    <Text allowFontScaling={false} style={styles.portfolioAmount}>
                        {totalReferralPoints || '0'} points earned
                    </Text>
                </LinearGradient>
                {/* <View style={styles.searchInput}>
                    <TouchableOpacity>
                        <Entypo name="magnifying-glass" size={22} color={Colors.grey} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder={'search'}
                        placeholderTextColor={Colors.grey}
                    />
                </View> */}
                <CustomButton onPress={goToReferralDetails} title={'Add Referral'} />
            </View>
        );
    };
    return (
        <View style={CommonStyles.container}>
            <CustomHeader
                title={loading ? null : referrals.length === 0 ? "Refer & Get Reward" : "Referrals"}
                showBack
            />          {loading ? (
                <Loader />
            ) : noData ? (
                <ReferralBox />
            ) : (
                <>
                    {renderAddReferralContainer()}
                    {renderContent()}
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: responsiveHeight(2),
        marginHorizontal: responsiveWidth(5),
    },

    searchInput: {
        flexDirection: 'row',
        height: responsiveHeight(4.5),
        borderRadius: 8,
        backgroundColor: Colors.inputFieldBg,
        paddingHorizontal: responsiveWidth(2),
        alignItems: 'center',
    },
    searchTextInput: {
        fontFamily: '500',
        fontSize: responsiveFontSize(1.7),
        marginLeft: responsiveWidth(2),
        color: Colors.DARKGRAY,
        width: responsiveWidth(35),
    },
    scrollContent: {
        paddingBottom: Platform.OS === 'ios' ? responsiveHeight(13) : responsiveHeight(16),
        paddingHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(1)
    },

    flatList: {
        marginTop: responsiveHeight(1),
        paddingBottom: responsiveHeight(12),
    },

    referralName: {
        fontSize: 14,
        color: Colors.blue,
        fontFamily: Fonts.Semibold700,
        width: responsiveWidth(77),
    },
    referralDate: {
        fontSize: 11,
        color: Colors.blue,
        fontFamily: Fonts.Semibold700,
        width: responsiveWidth(77),
        marginTop: responsiveHeight(0.3)
    },
    referralPoints: {
        fontSize: 14,
        color: Colors.blue,
        fontFamily: Fonts.Semibold700
    },
    noDataText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2),
        color: Colors.DARKGRAY,
        marginTop: responsiveHeight(3),

    },

    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(0.5)
    },
    portfolioAmount: {
        fontSize: 14,
        color: Colors.white,
        fontFamily: Fonts.Semibold700,
    },
    blueContainerStyle: {
        borderRadius: 8,
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveHeight(0.5),
        width: responsiveWidth(42)
    },
    centerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReferralList;
