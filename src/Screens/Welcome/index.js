import { View, StyleSheet, ImageBackground,Platform } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import CustomButton from '../../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import images from '../../Themes/Images';


const Welcome = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={images.WelcomeImg} style={styles.image}>
        <View style={styles.footerStyle}>
          <CustomButton
            title={'Continue'}
            buttonStyle={styles.buttonStyle}
            onPress={handleNext}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
  },

  buttonStyle: {
    marginTop:responsiveHeight(2.5),
        marginBottom:Platform.OS === 'ios' ? 0 : responsiveHeight(5)

  },

  footerStyle: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    alignSelf: 'center'

  }

});
