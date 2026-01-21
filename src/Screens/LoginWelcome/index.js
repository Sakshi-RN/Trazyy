import { View, StyleSheet, ImageBackground,TouchableOpacity } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import CustomButton from '../../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import images from '../../Themes/Images';
import { LetStartBtn} from '../../Assets/svg';



const LoginWelcome = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('BTabNavigation');
  };
  return (
    <View style={styles.container}>
      <ImageBackground   source={images.Splashbg} style={styles.image}>
        <TouchableOpacity style={styles.footerStyle} onPress={handleNext}>
          <LetStartBtn/>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginWelcome;

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
    marginTop:responsiveHeight(27)
  }

});
