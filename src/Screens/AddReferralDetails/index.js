import { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard, ScrollView
} from 'react-native';
import { CommonStyles } from '../../Themes/CommonStyles';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import CustomButton from '../../Components/CustomButton';
import CustomTextInput from '../../Components/CustomTextInput';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import CustomHeader from '../../Components/CustomHeader';
import { ReferalFirstprogress } from '../../Assets/svg';
import { Fonts } from '../../Themes/Fonts';
import getEnvVars from '../../utils/config';
import CustomBackButton from '../../Components/CustomBackButton';



const AddReferralDetails = () => {
    const navigation = useNavigation();
    const { baseURL, endpoints } = getEnvVars();
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mentionName, setMentionName] = useState('yes');
    const [errors, setErrors] = useState({});
    const validatePhone = (phone) => phone.length === 10;

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateAlphabetic = (name) => /^[A-Za-z\s]+$/.test(name);

    const handleSubmit = async () => {
        const newErrors = {};
        if (!firstName) {
            newErrors.firstName = 'First name is required.';
        } else if (!validateAlphabetic(firstName)) {
            newErrors.firstName = 'First name should contain only alphabets.';
        }

        if (!lastName) {
            newErrors.lastName = 'Last name is required.';
        } else if (!validateAlphabetic(lastName)) {
            newErrors.lastName = 'Last name should contain only alphabets.';
        }

        if (!email) newErrors.email = 'Email is required.';
        else if (!validateEmail(email)) newErrors.email = 'Invalid email address.';

        if (!phone) newErrors.phone = 'Phone number is required.';
        else if (!validatePhone(phone)) newErrors.phone = 'Phone number must be exactly 10 digits.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const token = await AsyncStorage.getItem('authToken');
        const userID = await AsyncStorage.getItem('userID');
        if (!token) {
            Alert.alert(('Error'), 'No token found.');
            return;
        }

        const payload = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            phone: phone,
            status: 'referral',
            source: 'referral',
            referredBy: userID
        };
        try {
            setLoading(true);
            const response = await fetch(`${baseURL}${endpoints.PRE_REFERRAL}`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            
            setLoading(false);

            if (response.ok) {
                if (result.userAlreadyExist) {
                    Alert.alert(('Validation Error'), result.message);
                } else if (result.status) {
                    const referralId = result.response.clientId;
                    navigation.navigate('ReferalDetails', { result: result, referralId });
                } else {
                    Alert.alert(('Error'), result.response?.statusMessage || 'Unknown error');
                }
            } else {
                Alert.alert(('Error'), `Error ${response.status}: ${result.message || 'Something went wrong'}`);
            }
        } catch (error) {
            setLoading(false);
            console.error('API Error:', error);
            Alert.alert(('Error'), ('Something went wrong. Please try again.'));
        }
    };


    const CustomRadioButton = ({ isSelected, onPress, label }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
            <View
                style={[styles.radioButton, { borderColor: isSelected ? Colors.blue : Colors.grey }]}>
                {isSelected && <Entypo name="check" size={14} color={isSelected ? Colors.blue : Colors.grey} />}
            </View>
            <Text allowFontScaling={false} style={[styles.radioGroupLabel, { marginLeft: responsiveWidth(1.5) }]}>{label}</Text>
        </TouchableOpacity>
    );

    const renderForm = () => (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.referralRow}>
                            <CustomTextInput
                                inputStyle={styles.inputViewStyle}
                                placeholder={'Enter First name'}
                                value={firstName}
                                onChangeText={setFirstName}
                                title={'First name'}
                                inputBox={styles.inputBox}
                            />
                            <CustomTextInput
                                placeholder={'Enter Last name'}
                                inputStyle={styles.inputViewStyle}
                                value={lastName}
                                onChangeText={setLastName}
                                title={'Last name'}
                            />
                        </View>
                        <View style={[styles.referralRow]}>
                            <View>
                                {errors.firstName && <Text allowFontScaling={false} style={styles.nameErrorText}>{errors.firstName}</Text>}
                            </View>
                            {errors.lastName && <Text allowFontScaling={false} style={[styles.nameErrorText]}>{errors.lastName}</Text>}
                        </View>
                        <CustomTextInput
                            placeholder={'Enter Email'}
                            value={email}
                            onChangeText={setEmail}
                            title={'Email'}
                            keyboardType="email-address"
                        />
                        {errors.email && <Text allowFontScaling={false} style={styles.errorText}>{errors.email}</Text>}

                        <CustomTextInput
                            placeholder={'Enter Phone'}
                            value={phone}
                            onChangeText={setPhone}
                            title={'Phone'}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                        {errors.phone && <Text allowFontScaling={false} style={styles.errorText}>{errors.phone}</Text>}
                        <View style={styles.radioGroup}>
                            <Text allowFontScaling={false} style={styles.radioGroupLabel}>Mention my name?</Text>
                            <CustomRadioButton
                                label={'Yes'}
                                isSelected={mentionName === 'yes'}
                                onPress={() => setMentionName('yes')}
                            />
                            <CustomRadioButton
                                label={'No'}
                                isSelected={mentionName === 'no'}
                                onPress={() => setMentionName('no')}
                            />
                        </View>
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
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );

    return (
        <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
            <CustomHeader title="Add New Referral" showBack />
            <ReferalFirstprogress style={styles.progressbarStyle} />
            {renderForm()}
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
        paddingBottom: responsiveHeight(4),
    },
    headerText: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        color: Colors.black,
        alignSelf: 'center'
    },
    referralRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputViewStyle: {
        width: responsiveWidth(40)
    },
    inputBox: {
        width: responsiveWidth(35)
    },

    submitbtn: {
        width: '48%',
    },
  
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
        width: responsiveWidth(50)
    },
    radioGroupLabel: {
        fontSize: 13,
        fontFamily: Fonts.Medium600,
        color: Colors.grey,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: responsiveWidth(2.5),
    },
    radioButton: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
    },
    nameErrorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(1),
        fontFamily: Fonts.Semibold700,
        width: responsiveWidth(40),
    },
    btnRowss: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2.5),
        marginBottom: responsiveHeight(3)
    },
});

export default AddReferralDetails;