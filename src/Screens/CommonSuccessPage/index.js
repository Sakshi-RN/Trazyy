import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { useNavigation, } from '@react-navigation/native';
import { SipSuccessProgress, SuccessImg } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const CommonSuccessPage = () => {

  const navigation = useNavigation();

  return (
    <View style={CommonStyles.container}>
      <CustomHeader
        title="Success"
        showBack={true}
      />
      <SipSuccessProgress style={styles.progressbarStyle} />
      <SuccessBox
        title="Investment successful"
        ImageComponent={SuccessImg}
        buttonTitle={'Explore More'}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },

});

export default CommonSuccessPage;
