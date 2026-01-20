import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');

const CustomButton = ({ title, onPress, buttonStyle, textStyle, disabled }) => {
  const [isTablet, setIsTablet] = useState(width >= 768);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsTablet(window.width >= 768);
    });
    return () => subscription?.remove();
  }, []);

  const styles = getStyles(isTablet);

  return (
    <LinearGradient
      colors={['#b0acacff', '#f7efefff', '#f9f5f5ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.button, buttonStyle]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
      >
        <Text allowFontScaling={false} style={[styles.text, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CustomButton;

const getStyles = (isTablet) =>
  StyleSheet.create({
    button: {
      borderColor: Colors.blue,
      borderRadius:15,
      paddingVertical: isTablet ? responsiveHeight(2.2) : responsiveHeight(1.1),
      paddingHorizontal: isTablet ? responsiveWidth(12) : responsiveWidth(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.8
    },
    text: {
      color: Colors.blue,
      fontSize: 15,
      fontFamily: Fonts.Semibold700,
    },
  });
