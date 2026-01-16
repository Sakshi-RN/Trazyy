import { StyleSheet, View, Image, Dimensions } from 'react-native';
import images from '../../Themes/Images';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.Splashbg}
        style={styles.image}
        resizeMode="cover" 
      />
    </View>
  );
};

export default Splash;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height,
  },
});
