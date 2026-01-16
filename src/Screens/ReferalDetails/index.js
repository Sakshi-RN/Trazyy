
import { useState } from 'react';
import {
    View, Text, StyleSheet, Platform, Alert, KeyboardAvoidingView,
    TouchableWithoutFeedback, ScrollView,
    Keyboard,
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomHeader from '../../Components/CustomHeader';
import { ReferralSecondProgress } from '../../Assets/svg';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';


const ReferalDetails = () => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const result = route.params.result;
    const referredId = result.response.clientId;
    const [location, setLocation] = useState('');
    const [automobileOwned, setAutomobileOwned] = useState('');
    const [clubMembership, setClubMembership] = useState('');
    const [description, setdescription] = useState('');
    const [errors, setErrors] = useState({
        location: '',
        automobileOwned: '',
        clubMembership: '',
        description: ''
    });

    const handleSubmit = async () => {
        setErrors({
            location: '',
            automobileOwned: '',
            clubMembership: '',
            description: ''
        });

        let isValid = true;
        let newErrors = {};

        if (!location) {
            newErrors.location = 'Address is required.';
            isValid = false;
        }
        if (!automobileOwned) {
            newErrors.automobileOwned = 'Automobile owned is required.';
            isValid = false;
        }
        if (!clubMembership) {
            newErrors.clubMembership = 'Club membership is required.';
            isValid = false;
        }
        if (!description) {
            newErrors.description = 'Please tell us something good about the referral.';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Error', 'No token found.');
            return;
        }

        const data = {
            referredId,
            automobileOwned,
            address1: location,
            clubMembership,
            description
        };
        try {
            setLoading(true);
            const response = await axios.put(
                `${baseURL}${endpoints.UPDATE_REFERRAL}`,
                data,
                {
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const res = response.data;

            if (res.status && res.response?.status) {
                setLoading(false);
                navigation.navigate('ReferralSuccessPage', { result: result });
            } else {
                setLoading(false);
                Alert.alert('Error', res.response?.message || 'You are not Authorized to update');
            }
        } catch (error) {
            setLoading(false);
            setErrors({ error: 'An error occurred. Please try again.' });
        }
    };

    const addReferalDetails = () => {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <CustomTextInput
                                placeholder={'Enter Location'}
                                title={'Location'}
                                value={location}
                                onChangeText={setLocation}
                            />
                            {errors.location ? <Text allowFontScaling={false} style={styles.errorText}>{errors.location}</Text> : null}
                            <CustomTextInput
                                placeholder={'Automobile owned'}
                                title={'Automobile owned'}
                                value={automobileOwned}
                                onChangeText={setAutomobileOwned}
                            />
                            {errors.automobileOwned ? <Text allowFontScaling={false} style={styles.errorText}>{errors.automobileOwned}</Text> : null}
                            <CustomTextInput
                                placeholder={'Club Membership'}
                                title={'Club Membership'}
                                value={clubMembership}
                                onChangeText={setClubMembership}
                            />
                            {errors.clubMembership ? <Text allowFontScaling={false} style={styles.errorText}>{errors.clubMembership}</Text> : null}
                            <CustomTextInput
                                placeholder={'About referral'}
                                title={'Tell us something good about the referral.'}
                                value={description}
                                onChangeText={setdescription}
                                maxLength={200}
                            />
                            {errors.description ? <Text allowFontScaling={false} style={styles.errorText}>{errors.description}</Text> : null}
                            {errors.general ? <Text allowFontScaling={false} style={styles.errorText}>{errors.general}</Text> : null}
                            <View style={styles.btnRowss}>
                                <CustomBackButton
                                    title="Cancel"
                                    onPress={() => navigation.goBack()}
                                />
                                <CustomButton
                                    buttonStyle={styles.submitbtn}
                                    title={loading ? <Loader /> : 'Next'}
                                    onPress={handleSubmit}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback >
            </KeyboardAvoidingView >
        );
    }

    return (
        <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
            <CustomHeader title="Add New Referral" showBack />
            <ReferralSecondProgress style={styles.progressbarStyle} />
            {addReferalDetails()}
        </View>
    );
};


const styles = StyleSheet.create({
    scrollContentStyle: {
        marginHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(3),
    },
    progressbarStyle: {
        alignSelf: 'center',
        marginTop: responsiveHeight(3)
    },
    headerRow: {
        paddingVertical: responsiveHeight(2),
        backgroundColor: Colors.OFFWHITE,
        borderRadius: 20,
        paddingHorizontal: responsiveWidth(3),
        top: responsiveHeight(-14),
        shadowColor: Platform.OS === 'ios' ? Colors.grey : Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 0.2,
        elevation: 5,
        marginHorizontal: responsiveWidth(3),
        paddingBottom: responsiveHeight(4)
    },
    headerText: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        color: Colors.black,
        alignSelf: 'center'
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
        fontSize: responsiveFontSize(1.7),
        marginTop: responsiveHeight(1),
        fontWeight: '500'
    },
    btnRowss: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2.5),
        marginBottom: responsiveHeight(3)
    },
});

export default ReferalDetails;