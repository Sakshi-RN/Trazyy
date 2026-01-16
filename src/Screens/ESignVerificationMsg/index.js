import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform, BackHandler } from 'react-native';
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
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const ESignVerificationMsg = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { kyc_req_id, identity_proof_id } = route.params || {};
    const { baseURL, endpoints } = getEnvVars();
    const [loading, setLoading] = useState(false);
    const [showWebView, setShowWebView] = useState(false);
    const [verificationUrl, setVerificationUrl] = useState('');

    const webViewRef = useRef(null);
    const isHandledRef = useRef(false);

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

    const handleESign = async () => {
        try {
            setLoading(true);
            const client_id = await AsyncStorage.getItem('clientID');

            if (!client_id || !kyc_req_id || !identity_proof_id) {
                setLoading(false);
                Alert.alert('Error', 'Missing required information (Client ID, KYC Request ID, or Identity Proof ID).');
                return;
            }

            const payload = {
                client_id: parseInt(client_id),
                kyc_req_id: kyc_req_id,
                postback_url: "https://docs.fintechprimitives.com/identity/required-information/",
                identity_proof_id: identity_proof_id
            };

            const response = await axios.post(`${baseURL}${endpoints.KYC_ESIGN}`, payload);
            setLoading(false);

            if (response.data?.status && response.data?.statusCode === "0") {
                const res = response.data.response;

                if (res.status) {
                    const redirectUrl = res.data?.redirect_url;

                    if (redirectUrl) {
                        setVerificationUrl(redirectUrl);
                        setShowWebView(true);
                        isHandledRef.current = false;
                    } else {
                        Alert.alert('Error', 'Redirect URL not found.');
                    }
                } else {
                    Alert.alert('Error', res.message || 'E-Sign initialization failed.');
                }
            } else {
                Alert.alert('Error', response.data?.statusMessage || 'Something went wrong.');
            }

        } catch (error) {
            setLoading(false);
            console.error("E-Sign Verification Error:", error);
            Alert.alert('Error', 'An error occurred while processing your request.');
        }
    };

    const handleNavigationStateChange = (navState) => {
        const { url } = navState;
        if (isHandledRef.current) return;

        if (url.startsWith("https://docs.fintechprimitives.com/identity/required-information/")) {
            isHandledRef.current = true;
            setShowWebView(false);
            navigation.navigate('KYCSuccess', { kyc_req_id });
        }
    };

    return (
        <View style={CommonStyles.container}>
            {!showWebView && <CustomHeader title="E-Sign Verification" showBack={false} />}
            {showWebView ? (
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                    <WebView
                        ref={webViewRef}
                        source={{ uri: verificationUrl }}
                        style={{ flex: 1, marginBottom: responsiveHeight(10) }}
                        onNavigationStateChange={handleNavigationStateChange}
                        startInLoadingState={true}
                        renderLoading={() => <Loader />}
                    />
                </SafeAreaView>
            ) : (
                <View style={styles.container}>
                    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                        <Text allowFontScaling={false} style={styles.messageText}>
                            We’ll now redirect you to complete the quick and secure e-sign, please click E-Sign now to proceed!
                        </Text>
                        <CustomButton
                            title={loading ? <Loader /> : "E-Sign now"}
                            onPress={handleESign}
                            disabled={loading}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(8),
    },
    scrollContentStyle: {
        alignItems: 'center',
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 4 },
        paddingBottom: responsiveHeight(3)
    },
    messageText: {
        fontSize: 15,
        color: Colors.darkGrey,
        fontFamily: Fonts.Semibold700,
        textAlign: 'center',
        marginVertical: responsiveHeight(1)
    },
});

export default ESignVerificationMsg;
