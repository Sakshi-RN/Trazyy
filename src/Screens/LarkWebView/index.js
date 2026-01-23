import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview'; // SDK might use this internally, but we use the SDK wrapper
import getEnvVars from '../../utils/config';
import { LarkFinServSDK, LarkFinServWebView } from 'larkfinserv-react-native-sdk';

const LarkWebView = ({ route, navigation }) => {
    // Expect these to be passed via route params or defined in env
    const {
        apiKey = getEnvVars().larkApiKey,
        apiSecret = getEnvVars().larkApiSecret,
        phoneNumber = '9821338451'
    } = route.params || {};

    const [sdk] = useState(() => new LarkFinServSDK({
        apiKey: apiKey,
        apiSecret: apiSecret,
        environment: 'production', // or 'sandbox' based on your need
    }));

    const [loading, setLoading] = useState(true);
    const [isSdkInitialized, setIsSdkInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Initialize SDK
    useEffect(() => {
        const initializeSDK = async () => {
            try {
                if (!apiKey || !apiSecret) {
                    throw new Error('Missing API Key or Secret');
                }

                await sdk.initialize({
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    phoneNumber: phoneNumber,
                });
                setIsSdkInitialized(true);

                // Helper to handle events
                sdk.on('READY', () => {
                    setLoading(false);
                });

                sdk.on('ERROR', (event) => {
                    console.error('LarkSDK: EVENT RECEIVED - ERROR', event);
                    setError(event?.data?.error?.message || 'Unknown SDK Error');
                    setLoading(false);
                });

                sdk.on('CLOSE', () => {
                    navigation.goBack();
                });

                sdk.on('CLOSE_FRAME', () => {
                    navigation.goBack();
                });

                // Fallback timeout in case READY never fires
                setTimeout(() => {
                    setLoading((currentLoading) => {
                        if (currentLoading) {
                            console.warn('LarkSDK: WARNING - Timed out waiting for READY event. Forcing loader hide.');
                            return false;
                        }
                        return currentLoading;
                    });
                }, 10000); // 10 seconds timeout

            } catch (err) {
                console.error('LarkSDK Init Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        initializeSDK();

        return () => {
            // Cleanup listeners if supported/needed
            try {
                sdk.off('READY');
                sdk.off('ERROR');
                sdk.off('CLOSE');
                sdk.off('CLOSE_FRAME');
            } catch (e) {
                console.log('Error detaching listeners', e);
            }
        };
    }, [apiKey, apiSecret, phoneNumber]);

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load Lark SDK: {error}</Text>
            </View>
        );
    }

    // We can use mode="inline" to render it directly in this view
    return (
        <View style={styles.container}>
            {isSdkInitialized && (
                <LarkFinServWebView
                    sdk={sdk}
                    mode="inline"
                />
            )}
            {loading && (
                <View style={[styles.center, StyleSheet.absoluteFill, { backgroundColor: 'white' }]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    {/* Optional: Show text if stuck */}
                    {isSdkInitialized && <Text style={{ marginTop: 10 }}>Loading Loan Journey...</Text>}
                </View>
            )}
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
