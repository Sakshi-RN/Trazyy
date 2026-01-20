import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import getEnvVars from '../../utils/config';

// Constants from the SDK
const SDK_API_URL = 'https://sdk-backend.larkfinserv.com';
const SDK_URL = 'https://sdk-lark.larkfinserv.com';

const LarkWebView = ({ route, navigation }) => {
    // Expect these to be passed via route params or defined in env
    const {
        apiKey = getEnvVars().larkApiKey,
        apiSecret = getEnvVars().larkApiSecret,
        // partnerId = 'YOUR_PARTNER_ID',
        phoneNumber = '9821338451'
    } = route.params || {};

    const [iframeUrl, setIframeUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize session and generate URL
    useEffect(() => {
        const initializeSDK = async () => {
            try {
                if (!apiKey || !apiSecret) {
                    throw new Error('Missing API Key or Secret');
                }

                // 1. Construct Init Endpoint
                let endpoint = `${SDK_API_URL}/loan-sdk/init`;
                if (phoneNumber) {
                    endpoint = `${endpoint}?phone=${phoneNumber}&isVerified=true`;
                }

                console.log('LarkSDK: Initializing session...', endpoint);
                console.log('LarkSDK: Using API Key:', apiKey, 'Length:', apiKey.length);
                // console.log('LarkSDK: Using API Secret:', apiSecret); // Don't log full secret in prod

                // 2. Call Init API
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'X-SDK-Key': apiKey,
                        'X-SDK-Secret': apiSecret,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('LarkSDK: Init failed', response.status, errorText);
                    throw new Error(`Init failed: ${response.status}`);
                }

                const data = await response.json();
                console.log('LarkSDK: Session initialized', data);

                if (!data || !data.sessionId) {
                    throw new Error('Invalid response: No sessionId');
                }

                const { sessionId, themeConfig, user, userId } = data;
                const finalUserId = user?.id || userId || data.userId;

                // 3. Generate WebView URL (iframe URL)
                const params = new URLSearchParams();
                params.append('authKey', apiKey);
                if (apiSecret) params.append('authSecret', apiSecret);
                if (sessionId) params.append('sessionId', sessionId);
                // if (partnerId) params.append('partnerId', partnerId);
                if (finalUserId) params.append('userId', finalUserId);
                if (themeConfig) params.append('theme', JSON.stringify(themeConfig));
                if (phoneNumber) params.append('phoneNumber', phoneNumber);

                const finalUrl = `${SDK_URL}?${params.toString()}`;
                console.log('LarkSDK: Loading URL', finalUrl);

                setIframeUrl(finalUrl);

            } catch (err) {
                console.error('LarkSDK Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        initializeSDK();
    }, [apiKey, apiSecret,]);

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('LarkSDK Message:', data);
            const { type } = data;

            switch (type) {
                case 'READY':
                    console.log('LarkSDK: Ready');
                    break;
                case 'ELIGIBILITY_RESULT':
                    console.log('LarkSDK: Result', data.data);
                    break;
                case 'CLOSE':
                case 'CLOSE_FRAME':
                    console.log('LarkSDK: Close requested');
                    navigation.goBack();
                    break;
            }
        } catch (e) {
            // Non-JSON message?
            console.log('WebView Message (raw):', event.nativeEvent.data);
        }
    };

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load Lark SDK: {error}</Text>
            </View>
        );
    }

    if (loading || !iframeUrl) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: iframeUrl }}
                style={{ flex: 1 }}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        padding: 20
    }
});

export default LarkWebView;
