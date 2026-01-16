import {
    View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
    TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity, Alert
} from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import SipCalendarComponent from '../../Components/SipCalendarComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { SIPNewProgress } from '../../Assets/svg';
import ModalDropdown from '../../Components/ModalDropdown';
import CustomBackButton from '../../Components/CustomBackButton';
import { formatCurrency } from '../../utils/formatCurrency';
import { Fonts } from '../../Themes/Fonts';
import getEnvVars from '../../utils/config';

const SIPNewForm = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { baseURL, endpoints } = getEnvVars();

    const { selectedScheme, folio } = route.params || {};
    const initialFreqs = route.params?.frequencyList || route.params?.frequencies || [];
    const [frequencyList, setFrequencyList] = useState(initialFreqs);

    const [amount, setAmount] = useState('');
    const [formattedAmount, setFormattedAmount] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [numInstallments, setNumInstallments] = useState('');
    const [agree, setAgree] = useState(false);
    const [installmentAgree, setInstallmentAgree] = useState(false);
    const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showFrequencyModal, setShowFrequencyModal] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [mandateList, setMandateList] = useState([]);
    const [folioLoading, setFolioLoading] = useState(false);

    useEffect(() => {
        if (route.params?.frequencyList && route.params.frequencyList.length > 0) {
            setFrequencyList(route.params.frequencyList);
        }
    }, [route.params]);

    useEffect(() => {
        fetchFolios();
        if (frequencyList && frequencyList.length === 1) {
            setSelectedFrequency(frequencyList[0]);
        }
    }, [frequencyList]);

    const fetchFolios = async () => {
        try {
            setFolioLoading(true);
            const ClientId = await AsyncStorage.getItem('clientID');
            if (!ClientId) {
                setFolioLoading(false);
                return;
            }
            const res = await axios.get(`${baseURL}${endpoints.GET_MF_FOLIOS}${ClientId}`);
            if (res.data?.response?.status && Array.isArray(res.data.response?.data)) {
                const folios = res.data.response.data.map(f => ({ label: f.number, value: f.number }));
                setMandateList(folios);
            } else {
                setMandateList([{ label: 'New Folio', value: 'new' }]);
            }
        } catch (err) {
            setMandateList([{ label: 'New Folio', value: 'new' }]);
        } finally {
            setFolioLoading(false);
        }
    };

    const formatWithCurrency = (num) => `₹${Number(num).toLocaleString('en-IN')}`;

    const handleChange = (text) => {
        let raw = text.replace(/\D/g, "");
        if (!raw) { setAmount(""); setFormattedAmount(""); setErrors({}); return; }
        const amt = parseInt(raw, 10);
        setAmount(raw);
        setFormattedAmount(formatWithCurrency(amt));

        let newErrors = {};
        if (!selectedFrequency) newErrors.selectedFrequency = "Please select frequency.";

        if (selectedFrequency) {
            if (amt < Number(selectedFrequency.minAmount)) {
                newErrors.amount = `SIP amount must be at least ₹${Number(selectedFrequency.minAmount)}`;
            } else if (amt > Number(selectedFrequency.maxAmount)) {
                newErrors.amount = `SIP amount must not exceed ₹${Number(selectedFrequency.maxAmount)}`;
            }
        }
        setErrors(newErrors);
    };

    const toggleCalendarModal = () => setCalendarModalVisible(!isCalendarModalVisible);

    const handleSubmit = async () => {
        let newErrors = {};
        if (!amount) newErrors.amount = "Please enter SIP amount.";
        if (!selectedFrequency) newErrors.selectedFrequency = "Please select frequency.";

        if (!dateOfBirth) {
            newErrors.dateOfBirth = "Please select start date.";
        } else if (selectedFrequency && Array.isArray(selectedFrequency.dates)) {
            const selectedDay = Number(dateOfBirth.split("-")[0]);
            if (!selectedFrequency.dates.includes(selectedDay)) {
                newErrors.dateOfBirth = "Start date is wrong.";
            }
        }
        if (!agree) {
            if (!numInstallments) {
                newErrors.numInstallments = "Please enter number of instalments.";
            } else if (selectedFrequency?.minInstallments && Number(numInstallments) < Number(selectedFrequency.minInstallments)) {
                newErrors.numInstallments = `Number of instalments must be at least ${selectedFrequency.minInstallments}.`;
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);
            const clientId = await AsyncStorage.getItem("clientID");
            const payload = {
                client_id: Number(clientId),
                scheme: selectedScheme.value,
                frequency: selectedFrequency?.value || selectedFrequency?.label?.toLowerCase(),
                start_date: (() => {
                    const [day, month, year] = dateOfBirth.split("-");
                    return `${year}-${month}-${day}`;
                })(),
                amount: Number(amount),
                folio_number: folio?.value || null,
                generate_first_installment_now: installmentAgree
            };

            if (agree) payload.until_cancelled = true;
            else if (numInstallments) payload.number_of_installments = Number(numInstallments);

            const res = await axios.post(`${baseURL}${endpoints.ADD_SIP}`, payload);
            console.log("res", res,payload);
            
            if (res.data?.response?.status) {
                navigation.navigate("SipNewListScreen", { selected_amount: Number(amount) });
            } else {
                const errorMessage = res.data?.response?.message || "Something went wrong.";
                Alert.alert("Error", "Server Error.");
                setErrors({ api: errorMessage });
            }
        } catch (err) {
            Alert.alert("Error", "Failed to create SIP.");
            setErrors({ api: "Failed to create SIP." });
        } finally {
            setLoading(false);
        }
    };

    const CheckboxRow = () => (
        <TouchableOpacity
            style={styles.row}
            onPress={() => { if (!numInstallments) setAgree(!agree); }}
            disabled={!!numInstallments}
        >
            <Icon
                name={agree ? 'check-square' : 'square-o'}
                size={20}
                color={numInstallments ? Colors.grey : Colors.blue}
            />
            <Text allowFontScaling={false} style={[styles.label, numInstallments && { color: Colors.grey }]}>
                or until cancelled
            </Text>
        </TouchableOpacity>
    );

    const InstallmentCheckbox = () => (
        <TouchableOpacity
            style={styles.row}
            onPress={() => { setInstallmentAgree(!installmentAgree); }}
        >
            <Icon
                name={installmentAgree ? 'check-square' : 'square-o'}
                size={20}
                color={Colors.blue}
            />
            <Text allowFontScaling={false} style={styles.label}>
                Generate 1st installment now
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(12) }]}>
            <CustomHeader title="SIP Purchase" showBack={true} />
            <SIPNewProgress style={styles.progressbarStyle} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}
                    >            <CustomTextInput
                            value={selectedFrequency?.label || ''}
                            placeholder="Select Frequency"
                            iconColor={selectedScheme ? Colors.grey : Colors.NEWLIGHTGREY}
                            isDropdown={true}
                            title={'Frequency Type'}
                            disabled={!selectedScheme}
                            onPress={() => frequencyList.length > 0 && setShowFrequencyModal(true)}
                        />
                        {errors.selectedFrequency && <Text style={styles.errorText}>{errors.selectedFrequency}</Text>}
                        <ModalDropdown visible={showFrequencyModal} data={frequencyList} onSelect={(item) => { setSelectedFrequency(item); setShowFrequencyModal(false); }} onClose={() => setShowFrequencyModal(false)} />

                        <CustomTextInput
                            placeholder="Enter Amount"
                            value={formattedAmount}
                            onChangeText={handleChange}
                            title={'SIP Amount'}
                            keyboardType="numeric"
                        />
                        <Text allowFontScaling={false} style={styles.valuesText}>The SIP amount allowed between:</Text>
                        <Text allowFontScaling={false} style={styles.schemeText}>
                            {selectedFrequency
                                ? `${formatCurrency(selectedFrequency?.minAmount)} and ${formatCurrency(selectedFrequency?.maxAmount)}`
                                : formatCurrency(0)}

                        </Text>
                        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

                        <CustomTextInput
                            placeholder="DD-MM-YYYY"
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            title={'SIP Start Date'}
                            onPress={toggleCalendarModal}
                            editable={false}
                            iconName="calendar"
                            isDropdown={true}
                        />
                        <SipCalendarComponent
                            isCalendarModalVisible={isCalendarModalVisible}
                            closeCalendarModal={toggleCalendarModal}
                            dateSelected={(date) => {
                                setDateOfBirth(date);
                                if (selectedFrequency && Array.isArray(selectedFrequency.dates)) {
                                    const selectedDay = Number(date.split("-")[0]);
                                    if (!selectedFrequency.dates.includes(selectedDay)) {
                                        setErrors(prev => ({ ...prev, dateOfBirth: `Please select a valid SIP start date (${selectedFrequency.dates.join(", ")})` }));
                                    } else {
                                        setErrors(prev => {
                                            const n = { ...prev };
                                            delete n.dateOfBirth;
                                            return n;
                                        });
                                    }
                                }
                            }}
                            current={dateOfBirth}
                        />
                        <Text allowFontScaling={false} style={styles.valuesText}>This scheme allowed only these dates:</Text>
                        {
                            selectedFrequency ?
                                <Text allowFontScaling={false} style={styles.schemeText}>
                                    {selectedFrequency?.dates.join(", ")}
                                </Text> : null
                        }

                        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

                        <CustomTextInput
                            placeholder="Number of instalments"
                            value={numInstallments}
                            onChangeText={setNumInstallments}
                            keyboardType="numeric"
                            title={'Number of instalments'}
                            editable={!agree}
                        />
                        <Text allowFontScaling={false} style={styles.valuesText}>Minimum instalments allowed ≥ {selectedFrequency?.minInstallments}</Text>
                        <CheckboxRow />
                        {errors.numInstallments && <Text style={styles.errorText}>{errors.numInstallments}</Text>}
                        <InstallmentCheckbox />
                        <View style={styles.btnRowss}>
                            <CustomBackButton title="Back" onPress={() => navigation.goBack()} />
                            <CustomButton buttonStyle={styles.submitbtn} textStyle={styles.submtText} title={loading ? <Loader /> : "Next"} onPress={handleSubmit} disabled={loading} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};




const styles = StyleSheet.create({
    scrollContentStyle: {
        marginHorizontal: responsiveWidth(5),
        marginVertical: responsiveHeight(3),
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

    valuesText: {
        color: Colors.skyblue,
        fontSize: 12,
        marginTop: responsiveHeight(0.5),
        fontFamily: Fonts.Semibold700,
    },
    schemeText: {
        color: Colors.grey,
        fontSize: 11,
        fontFamily: Fonts.Semibold700,
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
        width: '47%',

    },
    errorText: {
        color: Colors.red,
        fontSize: 12,
        marginTop: responsiveHeight(0.5),
        fontFamily: Fonts.Semibold700
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
    label: {
        marginLeft: responsiveWidth(2),
        fontSize: 12,
        color: Colors.blue,
        fontFamily: Fonts.Semibold700,
    },

});

export default SIPNewForm;
