import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
    Alert,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import axios from 'axios';
import getEnvVars from '../../utils/config';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FatcaDetails = ({ route }) => {
    const navigation = useNavigation();
    const params = route.params || {};
    const [loading, setLoading] = useState(false);
    const [residentialStatus, setResidentialStatus] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthCountry, setBirthCountry] = useState('');
    const [isTaxResidentOtherThanIndia, setIsTaxResidentOtherThanIndia] = useState(false);
    const [isResStatusModalVisible, setIsResStatusModalVisible] = useState(false);
    const [isCitizenshipModalVisible, setIsCitizenshipModalVisible] = useState(false);
    const [isNationalityModalVisible, setIsNationalityModalVisible] = useState(false);
    const [isBirthCountryModalVisible, setIsBirthCountryModalVisible] = useState(false);
    const [residentialError, setresidentialError] = useState('');
    const [citizenshipError, setCitizenshipError] = useState('');
    const [nationalityError, setNationalityError] = useState('');
    const [birthCountryError, setBirthCountryError] = useState('');
    const [residentialStatusList, setResidentialStatusList] = useState([]);
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const env = getEnvVars();
                const residentialStatusRes = await axios.get(`${env.baseURL}${env.endpoints.RESIDENTIAL_STATUS}`);
                if (residentialStatusRes.data && residentialStatusRes.data.status) {
                    const formattedList = residentialStatusRes.data.response.map(item => ({
                        id: item.id,
                        label: item.masterValueDesc
                    }));
                    setResidentialStatusList(formattedList);
                }
                const countryRes = await axios.get(`${env.baseURL}${env.endpoints.COUNTRY_LIST}`);
                if (countryRes.data && countryRes.data.status) {
                    const formattedList = countryRes.data.response.map(item => ({
                        id: item.id,
                        label: item.masterValueDesc
                    }));
                    setCountryList(formattedList);
                }
            } catch (error) {
                console.error("Error fetching FATCA details master data", error);
                Alert.alert('Error', 'Failed to fetch master data');
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        let valid = true;
        setresidentialError('');
        setCitizenshipError('');
        setNationalityError('');
        setBirthCountryError('');

        if (!residentialStatus) {
            setresidentialError('Residential Status is required');
            valid = false;
        }
        if (!citizenship) {
            setCitizenshipError('Citizenship is required');
            valid = false;
        }
        if (!nationality) {
            setNationalityError('Nationality is required');
            valid = false;
        }
        if (!birthCountry) {
            setBirthCountryError('Country of Birth is required');
            valid = false;
        }

        if (!valid) return;

        setLoading(true);
        try {
            const client_id = await AsyncStorage.getItem('clientID');
            if (!client_id) {
                setLoading(false);
                Alert.alert('Error', 'Client ID not found. Please login again.');
                return;
            }

            const env = getEnvVars();
            const payload = {
                client_id: client_id,
                aadhaar_number: params.aadhaar_number,
                father_name: params.father_name,
                marital_status: params.marital_status,
                residential_status: residentialStatus,
                citizenship_countries: citizenship,
                nationality_country: nationality,
                country_of_birth: birthCountry,
                tax_residency_other_than_india: false, 
                longitude: 77.354,
                latitude: 11.453   
            };

            const response = await axios.post(
                `${env.baseURL}${env.endpoints.CREATE_KYC_REQUEST}`,
                payload
            );
            
            setLoading(false);

            if (response.data && response.data.status) {
                if (response.data.response && response.data.response.status) {
                    const kyc_req_id = response.data.response.kyc_req_id;
                 navigation.navigate('SignatureUpload', { kyc_req_id: kyc_req_id }) 
                } else {
                    Alert.alert('Error', response.data.response.message || 'Failed to create KYC request');
                }
            } else {
                Alert.alert('Error', response.data.statusMessage || 'Something went wrong');
            }

        } catch (error) {
            setLoading(false);
            console.error("KYC Request Error", error);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={CommonStyles.container}>
            <CustomHeader title="Citizenship Details" showBack />
            {loading ? (
                <View style={styles.centerLogo}><Loader /></View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>

                            <CustomTextInput
                                title="Residential Status"
                                placeholder="Select Residential Status"
                                value={residentialStatus}
                                isDropdown={true}
                                onPress={() => setIsResStatusModalVisible(true)}
                            />
                            <ModalDropdown
                                visible={isResStatusModalVisible}
                                data={residentialStatusList}
                                onSelect={(item) => { setResidentialStatus(item.label); setIsResStatusModalVisible(false); }}
                                onClose={() => setIsResStatusModalVisible(false)}
                            />
                            {residentialError ?<Text allowFontScaling={false} style={styles.errorText}>{residentialError}</Text> : null}

                            <CustomTextInput
                                title="Countries of Citizenship"
                                placeholder="Select Citizenship"
                                value={citizenship}
                                isDropdown={true}
                                onPress={() => setIsCitizenshipModalVisible(true)}
                            />
                            {citizenshipError ?<Text allowFontScaling={false} style={styles.errorText}>{citizenshipError}</Text> : null}
                            <ModalDropdown
                                visible={isCitizenshipModalVisible}
                                data={countryList}
                                onSelect={(item) => { setCitizenship(item.label); setIsCitizenshipModalVisible(false); }}
                                onClose={() => setIsCitizenshipModalVisible(false)}
                            />

                            <CustomTextInput
                                title="Country of Nationality"
                                placeholder="Select Nationality"
                                value={nationality}
                                isDropdown={true}
                                onPress={() => setIsNationalityModalVisible(true)}
                            />
                            {nationalityError ?<Text allowFontScaling={false} style={styles.errorText}>{nationalityError}</Text> : null}
                            <ModalDropdown
                                visible={isNationalityModalVisible}
                                data={countryList}
                                onSelect={(item) => { setNationality(item.label); setIsNationalityModalVisible(false); }}
                                onClose={() => setIsNationalityModalVisible(false)}
                            />

                            <CustomTextInput
                                title="Country of Birth"
                                placeholder="Select Country of Birth"
                                value={birthCountry}
                                isDropdown={true}
                                onPress={() => setIsBirthCountryModalVisible(true)}
                            />
                            {birthCountryError ?<Text allowFontScaling={false} style={styles.errorText}>{birthCountryError}</Text> : null}
                            <ModalDropdown
                                visible={isBirthCountryModalVisible}
                                data={countryList}
                                onSelect={(item) => { setBirthCountry(item.label); setIsBirthCountryModalVisible(false); }}
                                onClose={() => setIsBirthCountryModalVisible(false)}
                            />

                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity
                                    style={[styles.checkbox, isTaxResidentOtherThanIndia && styles.checkedCheckbox]}
                                    onPress={() => setIsTaxResidentOtherThanIndia(!isTaxResidentOtherThanIndia)}
                                >
                                    {isTaxResidentOtherThanIndia &&<Text allowFontScaling={false} style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                               <Text allowFontScaling={false} style={styles.checkboxLabel}>
                                    Declaration of Non Indian Tax Residency
                                </Text>
                            </View>

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
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(3),
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: Colors.blue,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: Colors.blue, 
        borderColor: Colors.blue,
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
    },
    checkboxLabel: {
        fontSize: 13,
        color: Colors.black,
        fontFamily: Fonts.Semibold700, 
    },
});

export default FatcaDetails;
