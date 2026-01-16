import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import Colors from '../../Themes/Colors';

const WebViewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { url, successUrl, nextScreen, nextParams, title = "Verification" } = route.params || {};
    const [loading, setLoading] = useState(true);

    const handleNavigationStateChange = (navState) => {
        const { url: currentUrl } = navState;
        if (successUrl && currentUrl.startsWith(successUrl)) {
            if (nextScreen) {
                navigation.replace(nextScreen, nextParams);
            } else {
                navigation.goBack();
            }
        }
    };

    return (
        <View style={CommonStyles.container}>
            <CustomHeader title={title} showBack={true} />
            <View style={styles.webViewContainer}>
                <WebView
                    source={{ uri: url }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.blue} />
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    webViewContainer: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});

export default WebViewScreen;
