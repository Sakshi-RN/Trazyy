import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import axios from 'axios';
import getEnvVars from '../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import SuccessBox from '../../Components/SuccessBox';
import { SuccessImg } from '../../Assets/svg';


const KYCSuccess = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { kyc_req_id } = route.params || {};
    const { baseURL, endpoints } = getEnvVars();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Home');
                return true;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => backHandler.remove();
        }, [navigation])
    );

    useEffect(() => {
        checkKYCStatus();
    }, []);

    const checkKYCStatus = async () => {
        try {
            const client_id = await AsyncStorage.getItem('clientID');
            if (!client_id || !kyc_req_id) {
                setLoading(false);
                setMessage("Missing required information.");
                return;
            }

            const response = await axios.get(`${baseURL}${endpoints.GET_KYC_STATUS}${client_id}?kyc_req_id=${kyc_req_id}`);

            setLoading(false);

            if (response.data?.status && response.data?.statusCode === "0") {
                const res = response.data.response;
                if (res.status && res.data?.status === 'submitted') {
                    setIsSuccess(true);
                    setMessage("Your KYC request has been successfully submitted to the KRA!");
                } else {
                    setIsSuccess(false);
                    setMessage("Oops! Something went wrong while submitting your KYC request. Please try again later.");
                }
            } else {
                setIsSuccess(false);
                setMessage("Oops! Something went wrong while submitting your KYC request. Please try again later.");
            }

        } catch (error) {
            setLoading(false);
            console.error("KYC Status Check Error:", error);
            setMessage("Oops! Something went wrong while submitting your KYC request. Please try again later.");
        }
    };

    const handleContinue = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={CommonStyles.container}>
            <CustomHeader title="KRA Success" showBack={false} />
            <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                <SuccessImg />
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Text allowFontScaling={false} style={styles.messageText}>
                            {message}
                        </Text>
                        <CustomButton
                            title="Continue"
                            onPress={handleContinue}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContentStyle: {
        marginHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(5),
        alignItems: 'center',
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 4 },
        paddingBottom: responsiveHeight(3)
    },
    messageText: {
        fontSize: 18,
        color: Colors.darkGrey,
        fontFamily: Fonts.Semibold700,
        textAlign: 'center',
        marginVertical: responsiveHeight(2)
    },
});

export default KYCSuccess;
