import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';

const OTPInput = ({ length = 6, otp, setOtp, isOtpValid }) => {
  const inputs = useRef([]);

  // Fixed size for 6 digits
  const boxSize = responsiveWidth(13);
  const gap = 10;

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    if (value === '') {
      newOtp[index] = '';
    } else if (!isNaN(value)) {
      newOtp[index] = value;
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }
    setOtp(newOtp);
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    } else if (event.nativeEvent.key === 'Backspace') {
      handleChange('', index);
    }
  };

  return (
    <View style={[styles.otpContainer, { gap }]}>
      {otp.map((digit, index) => (
        <TextInput
           allowFontScaling={false}
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          style={[
            styles.input,
            { width: boxSize, height: boxSize },
            digit ? styles.inputFilled : null,
            !isOtpValid && styles.inputInvalid,
          ]}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
          selectionColor={Colors.black}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the inputs
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    alignSelf: 'center',

  },
  input: {
    borderRadius: 16, // More rounded corners
    backgroundColor: '#E8E8E8', // Light grey background like screenshot
    fontSize: 24,
    color: Colors.black,
    fontFamily: Fonts.Bold800,
    fontWeight: 'bold',
    borderWidth: 0, // No border by default
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    shadowColor: "#000", // Slight shadow for depth if needed, but flat is cleaner
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.0,
    elevation: 1,
  },
  inputFilled: {
    backgroundColor: '#D3D3D3', // Slightly darker when filled or focused potentially
    // Or keep same background
  },
  inputInvalid: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
});

export default OTPInput;
