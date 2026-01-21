import { View, StyleSheet, ImageBackground,TouchableOpacity } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import images from '../../Themes/Images';
import { GetStartBtn} from '../../Assets/svg';



const OTPVerifiedSuccess = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('LoginWelcome');
  };
  return (
    <View style={styles.container}>
      <ImageBackground  source={images.OTPVerifiedSuccessimg} style={styles.image}>
        <TouchableOpacity style={styles.footerStyle} onPress={handleNext}>
          <GetStartBtn/>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default OTPVerifiedSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },

  footerStyle: {
    marginTop:responsiveHeight(18)
  }

});
