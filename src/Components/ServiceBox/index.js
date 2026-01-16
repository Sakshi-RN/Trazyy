// components/ServiceBox.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';

const ServiceBox = ({
  title,
  SvgIcon,
  borderColor = Colors.primary, // default fallback
  onPress,
  width = responsiveWidth(40),
  marginHorizontal = responsiveWidth(2),
  svgSize, // ✅ single dynamic prop
  svgwidth, // optional (if needed separately)
  svgheight, // optional (if needed separately)
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor,
          width,
          marginHorizontal
        },
      ]}
      onPress={onPress}
    >
      <Text allowFontScaling={false} style={styles.title}>{title}</Text>
      {SvgIcon && (
           <SvgIcon
          style={styles.svgStyle}
          width={svgSize || svgwidth || Platform.select({ ios: 53, android: 48 })}
          height={svgSize || svgheight || Platform.select({ ios: 55, android: 48 })}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(10),
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    shadowColor: Colors.grey,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 15,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 13,
    fontFamily: Fonts.Semibold700,
    color: Colors.blue,
    alignSelf: 'center',
  },
  svgStyle: {
    alignSelf: 'center'
  },
});

export default ServiceBox;
