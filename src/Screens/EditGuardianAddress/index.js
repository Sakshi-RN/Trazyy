
import { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Loader from '../../Components/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { NomineeSecondProgress } from '../../Assets/svg';
import CustomBackButton from '../../Components/CustomBackButton';
import ModalDropdown from '../../Components/ModalDropdown';
import getEnvVars from '../../utils/config';


const EditGuardianAddress = () => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const { params } = useRoute();
    const nomineeData = params || {};

    const [loading, setLoading] = useState(false);
    const [guardianAddress, setGuardianAddress] = useState(nomineeData.guardianAddress || '');
    const [guardianPincode, setGuardianPincode] = useState(nomineeData.guardianPincode || '');
    const [installmentAgree, setInstallmentAgree] = useState(nomineeData.isSameAsPrimary || false);
    const [addressError, setAddressError] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [stateList, setStateList] = useState([]);
    const [isStateModalVisible, setIsStateModalVisible] = useState(false);
    const [backupAddress, setBackupAddress] = useState('');
    const [backupPincode, setBackupPincode] = useState('');


    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);

            const ClientId = await AsyncStorage.getItem('clientID');
            if (!ClientId) {
                setGeneralError('No client ID found');
                return;
            }

            const res = await axios.get(
                `${baseURL}${endpoints.GET_NOMINEE_DETAILS}${ClientId}`
            );

            if (res.data?.response?.status) {
                const d = res.data.response.data || {};
                if (!nomineeData.guardianAddress) setGuardianAddress(d.guardianAddress || '');
                if (!nomineeData.guardianPincode) setGuardianPincode(d.guardianPincode || '');
            }
        } catch (err) {
            setGeneralError('Failed to load guardian data');
        } finally {
            setLoading(false);
        }
    }, [baseURL, endpoints, nomineeData]);

    const fetchStates = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${baseURL}${endpoints.GET_STATE}`
            );
            if (res.data?.response?.length) {
                setStateList(
                    res.data.response.map(r => ({
                        id: r.id,
                        label: r.statename,
                    }))
                );
            } else {
                setStateList([]);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to load states');
        } finally {
            setLoading(false);
        }
    }, [baseURL, endpoints]);

    useEffect(() => {
        fetchProfile();
        fetchStates();
    }, [fetchProfile, fetchStates]);


    const toggleStateModal = () => {
        setIsStateModalVisible(!isStateModalVisible);
    };
    const selectState = (selected) => {
        setGuardianState(selected.label);
        setStateError('');
        setIsStateModalVisible(false);
    };

    const fetchPrimaryHolderDetails = useCallback(async () => {
        try {
            setLoading(true);
            const ClientId = await AsyncStorage.getItem('clientID');
            if (!ClientId) {
                setGeneralError('No client ID found');
                return;
            }

            const url = `${baseURL}${endpoints.GET_NOMINEE_DETAILS}${ClientId}`;
            const res = await axios.get(url);

            if (res.data?.response?.status && res.data?.response?.data) {
                const d = res.data.response.data;
                const fullAddr = d.nomineeAddress || '';

                setGuardianAddress(fullAddr);
                setGuardianPincode(d.nomineePincode || '');
                setAddressError('');
                setPincodeError('');
            } else {
                console.log('Could not fetch primary holder details');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to fetch primary holder details');
        } finally {
            setLoading(false);
        }
    }, [baseURL]);


    const handleSave = async () => {
        let valid = true;

        setAddressError('');
        setPincodeError('');
        setGeneralError('');

        if (!guardianAddress.trim()) {
            setAddressError('Guardian Address is required');
            valid = false;
        }

        if (!guardianPincode.trim()) {
            setPincodeError('Pincode is required');
            valid = false;
        } else if (guardianPincode.length !== 6) {
            setPincodeError('Please enter a valid 6-digit pincode');
            valid = false;
        }

        if (!valid) return;


        try {
            setLoading(true);
            const ClientId = await AsyncStorage.getItem('clientID');
            if (!ClientId) {
                setGeneralError('Missing authentication or client ID');
                setLoading(false);
                return;
            }

            const kycDataStr = await AsyncStorage.getItem('kycData');
            const kycData = kycDataStr ? JSON.parse(kycDataStr) : {};

            const body = {
                ...kycData,
                ...nomineeData,
                clientId: Number(ClientId),
                guardianAddress,
                guardianPincode,
            };

            const res = await axios.post(
                `${baseURL}${endpoints.ADD_KYC_DETAILS}`,
                body
            );

            if (res.data?.response?.status) {
                await AsyncStorage.removeItem('kycData');
                if (nomineeData?.nextScreen) {
                    navigation.navigate(nomineeData.nextScreen);
                } else {
                    navigation.navigate('NomineeSuccessPage');
                }
            } else {
                setGeneralError(res.data?.response?.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            setGeneralError('Something went wrong while saving');
        } finally {
            setLoading(false);
        }
    };

    const InstallmentCheckbox = () => (
        <TouchableOpacity
            style={styles.row}
            onPress={() => {
                const newValue = !installmentAgree;
                setInstallmentAgree(newValue);
                if (newValue) {
                    setBackupAddress(guardianAddress);
                    setBackupPincode(guardianPincode);
                    fetchPrimaryHolderDetails();
                } else {
                    setGuardianAddress(backupAddress);
                    setGuardianPincode(backupPincode);
                }
            }}
        >
            <Icon
                name={installmentAgree ? 'check-square' : 'square-o'}
                size={18}
                color={Colors.blue}
            />
            <Text allowFontScaling={false} style={styles.label}>
                Guardian address is same as the primary holder.
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={CommonStyles.container}>
            <CustomHeader title="Edit Guardian Address" showBack />
            <NomineeSecondProgress style={styles.progressbarStyle} />
            {loading ? (
                <View style={styles.centerLogo}>
                    <Loader />
                </View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                            <InstallmentCheckbox />
                            <CustomTextInput
                                placeholder="Enter Guardian Address"
                                value={guardianAddress}
                                onChangeText={(t) => {
                                    setGuardianAddress(t);
                                    setAddressError('');
                                }}
                                title="Guardian Address"
                            />
                            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
                            <CustomTextInput
                                placeholder="Enter Guardian Pincode"
                                value={guardianPincode}
                                onChangeText={(t) => {
                                    const cleaned = t.replace(/\D/g, '').slice(0, 6);
                                    setGuardianPincode(cleaned);
                                    setPincodeError('');
                                }}
                                title="Guardian Pincode"
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            {pincodeError ? <Text style={styles.errorText}>{pincodeError}</Text> : null}
                            {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}
                            <ModalDropdown
                                visible={isStateModalVisible}
                                data={stateList}
                                onSelect={selectState}
                                onClose={toggleStateModal}
                            />
                            <View style={styles.btnRowss}>
                                <CustomBackButton
                                    title="Back"
                                    onPress={() => {
                                        navigation.navigate({
                                            name: 'EditGuardianDetails',
                                            params: {
                                                ...nomineeData,
                                                guardianAddress,
                                                guardianPincode,
                                                isSameAsPrimary: installmentAgree
                                            },
                                            merge: true,
                                        });
                                    }}
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
        marginTop: responsiveHeight(4)
    },
    progressbarStyle: {
        alignSelf: 'center',
        marginTop: responsiveHeight(3)
    },
    inputWidth: {
        borderColor: Colors.lightGrey,
        borderWidth: 1.5,
        marginTop: responsiveHeight(1.5),
    },

    submitbtn: {
        width: '48%',
    },
    errorText: {
        color: Colors.red,
        fontSize: 18,
        marginTop: responsiveHeight(1),
        fontWeight: '500'
    },
    valuesText: {
        color: Colors.skyblue,
        fontSize: 12,
        marginTop: responsiveHeight(0.5),
        fontFamily: Fonts.Semibold700
    },
    schemeText: {
        color: Colors.grey,
        fontSize: 10,
        fontFamily: Fonts.Semibold700
    },
    referralRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnRowss: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2)
    },
    inputViewStyle: {
        borderColor: Colors.lightGrey,
        borderWidth: 1.5,
        marginTop: responsiveHeight(1.5),
        width: '47%'
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
    label: {
        marginLeft: responsiveWidth(2),
        fontSize: 12,
        color: Colors.grey,
        fontFamily: Fonts.Semibold700,
    },
    centerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disableEmailTextColor: {
        color: Colors.grey
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
});
export default EditGuardianAddress;
