import 'dotenv/config';

export default {
    expo: {
        name: "Trazyy",
        slug: "Trazyy",
        scheme: "investek",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.investek.mobile",
            buildNumber: "63",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSCameraUsageDescription: "Camera access is required to upload profile documents and verification images.",
                NSPhotoLibraryUsageDescription: "Photo library access is required to upload documents and profile images."
            }
        },
        android: {
            package: "com.investek.mobile",
            versionCode: 4,
            edgeToEdgeEnabled: true,
            intentFilters: [
                {
                    action: "VIEW",
                    data: [
                        {
                            scheme: "investek"
                        }
                    ],
                    category: [
                        "BROWSABLE",
                        "DEFAULT"
                    ]
                }
            ],
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            }
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-asset",
            "expo-web-browser"
        ],
        extra: {
            eas: {
                projectId: "e57ab86d-0b61-48dc-8575-5c0b5a3a5b08"
            },
            APP_ENV: process.env.APP_ENV || 'dev',
        }
    }
};
