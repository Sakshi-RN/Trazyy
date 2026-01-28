import React, { useState } from 'react';
import { View, Text, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import CustomTextInput from '../CustomTextInput';
import CustomButton from '../CustomButton';
import Loader from '../Loader';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const ReusableEnquiryModal = ({ visible, onClose, onSubmit, loading, title = "New Enquiry" }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert("Required", "Please enter a message to submit.");
            return;
        }

        const wordCount = message.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount > 250) {
            Alert.alert("Limit Exceeded", "Please limit your message to 250 words.");
            return;
        }

        onSubmit(message);
        setMessage(''); // Clear message after submit call (parent handles actual submission success/failure logic or we can create a better loop, but for now parent drives 'loading' so we assume submit will clear visible if success)
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text allowFontScaling={false} style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text allowFontScaling={false} style={styles.closeText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <Text allowFontScaling={false} style={styles.modalLabel}>How can we help you?</Text>

                        <CustomTextInput
                            placeholder="I am looking for investment options..."
                            value={message}
                            onChangeText={setMessage}
                            multiline={true}
                            inputStyle={styles.textArea}
                            textAlignVertical="top"
                        />

                        <Text allowFontScaling={false} style={[styles.wordCount,
                        message.trim().split(/\s+/).filter(w => w.length > 0).length > 250 ? { color: Colors.red } : {}
                        ]}>
                            {message.trim().split(/\s+/).filter(w => w.length > 0).length}/250 words
                        </Text>

                        <CustomButton
                            title={loading ? <Loader /> : "Submit"}
                            onPress={handleSubmit}
                            disabled={loading}
                            buttonStyle={styles.submitBtn}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: responsiveWidth(5),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(2),
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: Fonts.Bold800,
        color: Colors.blue,
    },
    closeText: {
        fontSize: 20,
        color: Colors.blue,
        fontFamily: Fonts.Bold800,
    },
    modalLabel: {
        fontSize: 14,
        fontFamily: Fonts.Medium600,
        color: Colors.black,
        marginBottom: responsiveHeight(1),
    },
    textArea: {
        height: responsiveHeight(18),
        marginBottom: responsiveHeight(2),
        borderRadius: 12,
        backgroundColor: '#E8E8E8',
        fontSize: 15,
        color: Colors.black,
        fontFamily: Fonts.Semibold700,
        alignItems: 'flex-start',
    },
    wordCount: {
        alignSelf: 'flex-end',
        fontSize: 12,
        color: Colors.grey,
        fontFamily: Fonts.Medium600,
        marginTop: -responsiveHeight(1),
    },
    submitBtn: {
        marginTop: responsiveHeight(2),
        alignSelf: 'center'
    }
});

export default ReusableEnquiryModal;
