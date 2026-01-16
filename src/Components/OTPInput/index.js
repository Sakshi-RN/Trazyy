import React, { useRef } from 'react';
import { View, TextInput, StyleSheet,Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';

const OTPInput = ({ length = 6, otp, setOtp, isOtpValid }) => {
  const inputs = useRef([]);

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
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          style={[
            styles.input,
            digit ? styles.inputFilled : null,
            !isOtpValid && styles.inputInvalid,
          ]}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
    
  },
  input: {
    width: responsiveWidth(13),
    height: Platform.OS === 'ios' ? responsiveHeight(5.5) : responsiveHeight(6),
    borderRadius: 8,
    backgroundColor: '#F7F8F8',
    marginRight: 10,
    fontSize: 20,
    color: Colors.black,
    fontFamily: Fonts.Bold800,
    fontWeight: 'bold',
     borderWidth:1,
     borderColor: '#E8ECF4',
     justifyContent:'center'
  },
  inputFilled: {
    borderColor: Colors.green,
    borderWidth:1,
    backgroundColor:Colors.white
  },
  inputInvalid: {
    borderColor: Colors.red,
    backgroundColor:Colors.white

  },
});

export default OTPInput;
