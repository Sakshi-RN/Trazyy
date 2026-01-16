import { View, Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomButton from '../CustomButton';
import { Fonts } from '../../Themes/Fonts';
import { useNavigation } from '@react-navigation/native'


const SuccessBox = ({ buttonTitle, messageText,ImageComponent,title,onPress }) => {

  
  return (
    <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
      <ImageComponent style={styles.image} />
      <Text allowFontScaling={false} style={styles.title}>{title}</Text>
  {messageText ? (
        <Text allowFontScaling={false} style={styles.message}>{messageText}</Text>
      ) : null}
      <CustomButton
        title={buttonTitle}
        buttonStyle={styles.button}
         onPress={onPress}
      />
    </View>

  );
};

export default SuccessBox;

const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    alignItems: 'center',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 4 },
    paddingBottom: responsiveHeight(3)
  },
  image: {
    marginTop: responsiveHeight(2)
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.Bold800,
    color: Colors.black,
alignSelf:'center',
textAlign:'center'
  },
  message: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
    textAlign:'center'
  },
  button: {
    marginTop: responsiveHeight(1)
  },

});
