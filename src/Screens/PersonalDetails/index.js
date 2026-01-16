import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import CustomBackButton from '../../Components/CustomBackButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import ModalDropdown from '../../Components/ModalDropdown';
import Loader from '../../Components/Loader';
import getEnvVars from '../../utils/config';

const PersonalDetails = () => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [loading, setLoading] = useState(false);

    // Fields
    const [fatherName, setFatherName] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [aadharLast4, setAadharLast4] = useState('');

    // Dropdown states
    const [isMaritalStatusModalVisible, setIsMaritalStatusModalVisible] = useState(false);
    const [maritalStatusList, setMaritalStatusList] = useState([]);

    // Errors
    const [fatherNameError, setFatherNameError] = useState('');
    const [maritalStatusError, setMaritalStatusError] = useState('');
    const [aadharLast4Error, setAadharLast4Error] = useState('');

    useEffect(() => {
        fetchMaritalStatus();
    }, []);

    const fetchMaritalStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${baseURL}${endpoints.MARITAL_STATUS}`
            );
            if (response.data?.response?.length) {
                setMaritalStatusList(response.data.response.map(item => ({
                    id: item.id,
                    label: item.masterValueDesc,
                })));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load marital status options');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        let valid = true;
        setFatherNameError('');
        setMaritalStatusError('');

        if (!fatherName) {
            setFatherNameError('Father\'s Name is required');
            valid = false;
        }
        if (!maritalStatus) {
            setMaritalStatusError('Marital Status is required');
            valid = false;
        }
        if (!aadharLast4) {
            setAadharLast4Error('Aadhar Last 4 Digits is required');
            valid = false;
        } else if (aadharLast4.length !== 4) {
            setAadharLast4Error('Please enter exactly 4 digits');
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        try {
            setTimeout(() => {
                setLoading(false);
                navigation.navigate('FatcaDetails', {
                    father_name: fatherName,
                    marital_status: maritalStatus,
                    aadhaar_number: aadharLast4
                });
            }, 1000);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={CommonStyles.container}>
            <CustomHeader title="Personal Details" showBack />
            {loading ? (
                <View style={styles.centerLogo}><Loader /></View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                            <CustomTextInput
                                title="Father's Name in Full"
                                placeholder="Enter Father's Name"
                                value={fatherName}
                                onChangeText={setFatherName}
                            />
                            {fatherNameError ? <Text style={styles.errorText}>{fatherNameError}</Text> : null}
                            <CustomTextInput
                                title="Marital Status"
                                placeholder="Select Marital Status"
                                value={maritalStatus}
                                isDropdown={true}
                                onPress={() => setIsMaritalStatusModalVisible(true)}
                            />
                            {maritalStatusError ? <Text style={styles.errorText}>{maritalStatusError}</Text> : null}
                            <ModalDropdown
                                visible={isMaritalStatusModalVisible}
                                data={maritalStatusList}
                                onSelect={(item) => { setMaritalStatus(item.label); setIsMaritalStatusModalVisible(false); }}
                                onClose={() => setIsMaritalStatusModalVisible(false)}
                            />
                            <CustomTextInput
                                title="Aadhar Card Last 4 Digits"
                                placeholder="Enter Last 4 Digits"
                                value={aadharLast4}
                                onChangeText={(text) => {
                                    if (/^\d{0,4}$/.test(text)) {
                                        setAadharLast4(text);
                                    }
                                }}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                            {aadharLast4Error ? <Text style={styles.errorText}>{aadharLast4Error}</Text> : null}
                            <View style={styles.btnRowss}>
                                <CustomBackButton
                                    title="Back"
                                    onPress={() => navigation.goBack()}
                                />
                                <CustomButton
                                    buttonStyle={styles.submitbtn}
                                    textStyle={styles.submtText}
                                    title="Save"
                                    onPress={handleSave}
                                />
                            </View>

                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
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
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },
});

export default PersonalDetails;
