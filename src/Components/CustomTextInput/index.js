import { View, TextInput, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fonts } from '../../Themes/Fonts';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  inputStyle,
  iconName,
  iconSize,
  iconColor,
  onPress,
  secureTextEntry,
  inputBox,
  maxLength,
  onPressIcon,
  keyboardType = 'default',
  editable = true,
  placeholderTextColor = Colors.grey,
  title,
  isDropdown = false,
}) => {
  return (
    <View>
      {title && (
        <Text allowFontScaling={false} style={styles.titleText}>
          {title}
        </Text>
      )}

      <TouchableOpacity
        onPress={isDropdown ? onPress : undefined}
        activeOpacity={isDropdown ? 0.7 : 1}
        style={[styles.container, inputStyle]}
      >
        {isDropdown ? (
          <Text allowFontScaling={false} style={[styles.inputTextStyle, { color: value ? Colors.blue : Colors.grey }]}>
            {value || placeholder}
          </Text>
        ) : (
          <TextInput
            style={[styles.input, inputBox]}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            keyboardType={keyboardType}
            editable={editable}
            allowFontScaling={false}
          />
        )}

        {iconName && (
          <TouchableOpacity onPress={onPressIcon}>
            <Icon
              name={iconName}
              size={iconSize || 12}
              color={iconColor || Colors.grey}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(6),
    // height: Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(6),
    justifyContent: 'space-between',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
    borderRadius: 25,
    borderWidth: 1,

  },
  input: {
    fontSize: 14,
    color: Colors.blue,
    fontFamily: Fonts.Medium600,
    // height: Platform.OS === 'ios' ? responsiveHeight(4) : responsiveHeight(5),
    width: responsiveWidth(70),


  },
  inputTextStyle: {
    fontSize: 12,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
    width: responsiveWidth(72)
  },

  titleText: {
    fontSize: 12,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(1),
    fontWeight: 'bold'

  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
    borderColor: '#ddd',
  },
});

export default CustomTextInput;
