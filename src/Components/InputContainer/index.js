
import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity,Platform } from 'react-native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fonts } from '../../Themes/Fonts';

const InputContainer = ({
    placeholder,
    iconName,
    inputStyle,
    value,
    editable,
    onChangeText,
    onPress,
    keyboardType,
    maxLength,
    dropdown,
    SvgIcon,
    svgIconUri,
extrainputStyle
}) => {
    return (
            <View style={[styles.textInput, inputStyle]}>
                <View style={styles.row}>
                 {SvgIcon && !svgIconUri && (
  <SvgIcon/>
)}

                <TextInput
                allowFontScaling={false}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.Gray}
                    style={[styles.input,extrainputStyle]}
                    value={value}
                    editable={editable}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
                </View>
                <TouchableOpacity onPress={onPress}>
                    {dropdown && (
                        <Icon
                           name="chevron-down"
                            size={15}
                            color={Colors.Gray}
                        />
                    )}
                </TouchableOpacity>
            </View>

    );
};
export default InputContainer;

const styles = StyleSheet.create({


    reasonContainer: {
        marginTop: 20,
    },
    label: {
        fontSize:14,
        color: Colors.black,
        fontWeight: 'bold',
        marginTop: responsiveHeight(1)
    },
   textInput: {
      borderRadius: 6,
      paddingHorizontal: responsiveHeight(1.5),
      marginTop: responsiveHeight(1.5),
      backgroundColor:'#F7F8F8',
     paddingVertical:Platform.OS === "android" ? responsiveHeight(0.5):responsiveHeight(1.5),
      marginHorizontal:responsiveWidth(6),
      flexDirection:'row',
      alignItems:'center',

    },
    row:{
flexDirection:'row',
alignItems:'center'

    },
    startStyle: {
        color: Colors.red,
        fontFamily: Fonts.Medium600,
        fontSize:14,
    },
    input: {
       fontSize: 13,
      fontFamily: Fonts.Semibold700,
      color: Colors.black,
       marginLeft: responsiveHeight(1.5),
   width:responsiveWidth(70)
    },
});


