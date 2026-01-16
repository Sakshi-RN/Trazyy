import { useState, useEffect, useCallback } from 'react';
import {
    View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
    TouchableWithoutFeedback, Keyboard, Text, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { NomineeFirstProgress } from '../../Assets/svg';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';
import Loader from '../../Components/Loader';

const EditGuardianDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params || {};
    const { baseURL, endpoints } = getEnvVars();

    const [loading, setLoading] = useState(false);
    const [guardianName, setGuardianName] = useState(params.guardianName || '');
    const [guardianPan, setGuardianPan] = useState(params.guardianPan || '');
    const [guardianEmail, setGuardianEmail] = useState(params.guardianEmail || '');
    const [guardianPhone, setGuardianPhone] = useState(params.guardianPhone || '');

    const [nameError, setNameError] = useState('');
    const [panError, setPanError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const ClientId = await AsyncStorage.getItem('clientID');
            if (!ClientId) return;

            const res = await axios.get(
                `${baseURL}${endpoints.GET_NOMINEE_DETAILS}${ClientId}`
            );

            if (res.data?.response?.status) {
                const d = res.data.response.data || {};
                if (!params.guardianName) setGuardianName(d.guardianName || '');
                if (!params.guardianPan) setGuardianPan(d.guardianPan || '');
                if (!params.guardianEmail) setGuardianEmail(d.guardianEmail || '');
                if (!params.guardianPhone) setGuardianPhone(d.guardianPhone ? String(d.guardianPhone) : '');
            }
        } catch (err) {
            console.error('Error fetching guardian details:', err);
        } finally {
            setLoading(false);
        }
    }, [baseURL, endpoints, params]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleGoBack = () => navigation.goBack();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = () => {
        let valid = true;
        setNameError('');
        setPanError('');
        setEmailError('');
        setPhoneError('');

        if (!guardianName.trim()) {
            setNameError('Guardian Name is required.');
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(guardianName.trim())) {
            setNameError('Name should contain only alphabets.');
            valid = false;
        }
        if (!guardianPan.trim()) {
            setPanError('Guardian PAN is required.');
            valid = false;
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(guardianPan.trim())) {
            setPanError('Please enter a valid PAN number.');
            valid = false;
        }
        if (!guardianEmail.trim()) {
            setEmailError('Guardian Email is required.');
            valid = false;
        } else if (!isValidEmail(guardianEmail.trim())) {
            setEmailError('Please enter a valid email.');
            valid = false;
        }
        const cleanedPhone = guardianPhone.replace(/\D/g, '');
        if (!guardianPhone.trim()) {
            setPhoneError('Guardian Phone is required.');
            valid = false;
        } else if (cleanedPhone.length !== 10) {
            setPhoneError('Please enter a valid 10-digit phone number.');
            valid = false;
        }
        if (!valid) return;

        navigation.navigate('EditGuardianAddress', {
            ...params,
            isGuardian: true,
            guardianName,
            guardianPan,
            guardianEmail,
            guardianPhone: cleanedPhone,
        });
    };

    return (
        <View style={[CommonStyles.container, { paddingBottom: Platform.OS === 'ios' ? responsiveHeight(12) : responsiveHeight(16) }]}>
            <CustomHeader title="Edit Guardian Details" showBack />
            <NomineeFirstProgress style={styles.progressbarStyle} />
            {loading ? (
                <View style={LocalStyles.centerLogo}>
                    <Loader />
                </View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                            <CustomTextInput
                                value={guardianName}
                                onChangeText={(t) => { setGuardianName(t); setNameError(''); }}
                                placeholder="Enter Guardian Name"
                                title="Guardian Name"
                            />
                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                            <CustomTextInput
                                value={guardianPan}
                                onChangeText={(t) => { setGuardianPan(t.toUpperCase()); setPanError(''); }}
                                placeholder="Enter Guardian PAN"
                                title="Guardian PAN"
                                maxLength={10}
                            />
                            {panError ? <Text style={styles.errorText}>{panError}</Text> : null}
                            <CustomTextInput
                                value={guardianEmail}
                                onChangeText={(t) => { setGuardianEmail(t); setEmailError(''); }}
                                placeholder="Enter Guardian Email"
                                title="Guardian Email"
                                keyboardType="email-address"
                            />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                            <CustomTextInput
                                value={guardianPhone}
                                onChangeText={(text) => {
                                    const cleaned = text.replace(/\D/g, '').slice(0, 10);
                                    setGuardianPhone(cleaned);
                                    setPhoneError('');
                                }}
                                placeholder="Guardian Phone"
                                keyboardType="phone-pad"
                                title={'Guardian Phone'}
                                maxLength={10}
                            />
                            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                            <View style={styles.btnRowss}>
                                <CustomBackButton
                                    title="Cancel"
                                    onPress={handleGoBack}
                                />
                                <CustomButton
                                    buttonStyle={styles.submitbtn}
                                    textStyle={styles.submtText}
                                    title="Next"
                                    onPress={handleNext}
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
        marginTop: responsiveHeight(3)
    },
    progressbarStyle: {
        alignSelf: 'center',
        marginTop: responsiveHeight(3)
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
    btnRowss: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(2)
    },
});

const LocalStyles = StyleSheet.create({
    centerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditGuardianDetails;
