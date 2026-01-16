import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const { width } = Dimensions.get('window');

const CustomBackButton = ({ title, onPress, buttonStyle, textStyle, disabled }) => {
  const [isTablet, setIsTablet] = useState(width >= 768);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsTablet(window.width >= 768);
    });
    return () => subscription?.remove();
  }, []);

  const styles = getStyles(isTablet);

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
    >
        <Text allowFontScaling={false} style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomBackButton;

const getStyles = (isTablet) =>
  StyleSheet.create({
    button: {
      borderRadius: isTablet ? 12 : 12,
      paddingVertical: isTablet ? responsiveHeight(2.2) : responsiveHeight(1.3),
      paddingHorizontal:responsiveWidth(15),
      alignItems: 'center',
      justifyContent: 'center'
     
    },
    text: {
      color: Colors.blue,
      fontSize:15,
      fontFamily: Fonts.Medium600,
       textDecorationLine:'underline'
    },
  });
