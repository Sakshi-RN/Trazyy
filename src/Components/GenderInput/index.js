import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fonts } from '../../Themes/Fonts';


const GenderInput = ({
    placeholder,
    value,
    inputStyle,
    iconName,
    title,
    inputViewStyle,
    onPress,
  titleColor = Colors.grey,
  titleText

}) => {
    return (
        <View>
<Text allowFontScaling={false} style={styles.titleTextStyle}>{titleText}</Text>
        <TouchableOpacity style={[styles.container, inputViewStyle]} onPress={onPress}>
            <Text allowFontScaling={false} style={[styles.titleText, { color: titleColor }]}>
        {title}
      </Text>
            <View style={styles.inputView}>
                <TextInput
                  allowFontScaling={false}
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.grey}
                    value={value}
                    editable={false}
                    disable
                />
                {iconName && (
                    <Icon
                        name={iconName}
                        size={15}
                        color={Colors.grey}
                    />
                )}
            </View>
        </TouchableOpacity>
          </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.LIGHTGREY,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: Platform.OS === 'ios' ? responsiveHeight(5) : responsiveHeight(6),
        justifyContent: 'space-between',
        marginTop: responsiveHeight(1),
    },
    input: {
        fontSize: 12,
        color: Colors.blue,
        fontFamily: Fonts.Semibold700,
        width: 'auto',
        height: responsiveHeight(5)
    },
    titleText: {
        fontSize: 12,
        fontFamily: Fonts.Semibold700,
        width: responsiveWidth(30),
    },
    inputView: {
        width: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(1),
    },
      titleTextStyle: {
    fontSize: 13,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(1),

  },
});

export default GenderInput;
