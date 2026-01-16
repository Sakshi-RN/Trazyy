import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../../Components/CustomButton';
import CustomBackButton from '../../Components/CustomBackButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import Loader from '../../Components/Loader';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getEnvVars from '../../utils/config';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const SignatureUpload = ({ route }) => {
    const navigation = useNavigation();
    const params = route.params || {};
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const validateFileSize = async (uri, sizeFromPicker = null) => {
        try {
            let fileSize = sizeFromPicker;

            if (!fileSize) {
                const fileInfo = await FileSystem.getInfoAsync(uri);
                fileSize = fileInfo.size;
            }

            if (fileSize > MAX_FILE_SIZE) {
                Alert.alert("File Too Large", "File size cannot exceed 2 MB.");
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    };


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            const isValid = await validateFileSize(asset.uri, asset.fileSize);
            if (!isValid) return;

            setSelectedFile({
                type: 'image',
                uri: asset.uri,
                name: asset.fileName || 'image.jpg',
            });
        }
    };

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'image/*'],
            copyToCacheDirectory: true,
        });

        if (result.assets && result.assets.length > 0) {
            const asset = result.assets[0];

            const isValid = await validateFileSize(asset.uri, asset.size);
            if (!isValid) return;

            setSelectedFile({
                type: 'document',
                uri: asset.uri,
                name: asset.name,
            });
        }
    };

const handleSave = async () => {
    if (!selectedFile) {
        Alert.alert('Error', 'Please select a signature file to upload.');
        return;
    }

    setLoading(true);

    try {
        const client_id = await AsyncStorage.getItem('clientID');
        if (!client_id) {
            setLoading(false);
            Alert.alert('Error', 'Client ID not found. Please login again.');
            return;
        }

        if (!params.kyc_req_id) {
            setLoading(false);
            Alert.alert('Error', 'KYC Request ID missing. Please try again.');
            return;
        }

        const env = getEnvVars();
        const formData = new FormData();

        formData.append('client_id', client_id);
        formData.append('kyc_req_id', params.kyc_req_id);

        // --- IMPORTANT FIX FOR ANDROID ---
        let fileUri = selectedFile.uri;
        if (!fileUri.startsWith("file://")) {
            fileUri = "file://" + fileUri;
        }

        const fileType =
            selectedFile.type === "image" ? "image/jpeg" : "application/pdf";

        formData.append("file", {
            uri: fileUri,
            type: fileType,
            name: selectedFile.name || "signature.jpg",
        });

        const response = await axios.post(
            `${env.baseURL}${env.endpoints.UPLOAD_SIGNATURE}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
                timeout: 30000, // Android needs more time
            }
        );

        setLoading(false);

        if (response.data && response.data.status) {
            if (response.data.response?.status) {
                navigation.navigate('AadhaarVerificationMsg', { 
                    kyc_req_id: params.kyc_req_id 
                });
            } else {
                Alert.alert(
                    'Error',
                    response.data.response?.message || 'Upload failed'
                );
            }
        } else {
            Alert.alert(
                'Error',
                response.data.statusMessage || 'Something went wrong'
            );
        }

    } catch (error) {
        setLoading(false);
        console.log("Upload error:", error);

        if (error.message?.includes("Network Error")) {
            Alert.alert('Error', 'Network error — please try again.');
        } else {
            Alert.alert('Error', 'Something went wrong during upload.');
        }
    }
};


    return (
        <View style={CommonStyles.container}>
            <CustomHeader title="Signature Upload" showBack />
            {loading ? (
                <View style={styles.centerLogo}><Loader /></View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>

                    <Text allowFontScaling={false} style={styles.label}>Upload Investor's Signature</Text>
                    <Text allowFontScaling={false} style={styles.subLabel}>Supported formats: JPEG, PNG, PDF</Text>

                    <View style={styles.uploadContainer}>
                        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                            <Text allowFontScaling={false} style={styles.uploadButtonText}>Pick Image from Gallery</Text>
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={styles.labelOR}>OR</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                            <Text allowFontScaling={false} style={styles.uploadButtonText}>Pick Document</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedFile && (
                        <View style={styles.previewContainer}>
                            <Text allowFontScaling={false} style={styles.previewLabel}>Selected File:</Text>
                            {selectedFile.type === 'image' ? (
                                <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.documentPreview}>
                                    <Text allowFontScaling={false} style={styles.documentName}>{selectedFile.name}</Text>
                                </View>
                            )}
                            <TouchableOpacity onPress={() => setSelectedFile(null)} >
                                <Text allowFontScaling={false} style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.btnRowss}>
                        <CustomBackButton
                            title="Back"
                            onPress={() => navigation.goBack()}
                        />
                        <CustomButton
                            buttonStyle={styles.submitbtn}
                            textStyle={styles.submtText}
                            title="Upload"
                            onPress={handleSave}
                        />
                    </View>

                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContentStyle: {
        marginHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(3),
        paddingBottom: responsiveHeight(5)
    },
    centerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontFamily: Fonts.Semibold700,
        color: Colors.black,
        marginBottom: responsiveHeight(1),
    },
    labelOR: {
        fontSize: 14,
        fontFamily: Fonts.Semibold700,
        color: Colors.black,
        marginTop: responsiveHeight(3),
        marginHorizontal: responsiveWidth(2)
    },
    subLabel: {
        fontSize: 12,
        fontFamily: Fonts.Regular400,
        color: Colors.grey,
        marginBottom: responsiveHeight(2),
    },
    uploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(3),
    },
    uploadButton: {
        backgroundColor: Colors.lightGrey,
        padding: responsiveHeight(2),
        borderRadius: 8,
        width: responsiveWidth(36),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderStyle: 'dashed'
    },
    uploadButtonText: {
        fontSize: 14,
        fontFamily: Fonts.Medium600,
        color: Colors.black,
        textAlign: 'center'
    },
    previewContainer: {
        marginTop: responsiveHeight(2),
        alignItems: 'center',
        padding: responsiveHeight(2),
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
    },
    previewLabel: {
        fontSize: 14,
        fontFamily: Fonts.Medium500,
        marginBottom: responsiveHeight(1),
    },
    previewImage: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: responsiveHeight(1),
    },
    documentPreview: {
        padding: responsiveHeight(2),
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: responsiveHeight(1),
    },
    documentName: {
        fontSize: 14,
        fontFamily: Fonts.Regular400,
        color: Colors.black,
    },
    removeButtonText: {
        color: Colors.red,
        fontSize: 14,
        fontFamily: Fonts.Semibold700,
        marginTop: responsiveHeight(1),

    },
    btnRowss: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(4),
        marginBottom: responsiveHeight(2)
    },
    submitbtn: {
        width: '48%',
    },
    submtText: {
        fontSize: 16,
    }
});

export default SignatureUpload;
