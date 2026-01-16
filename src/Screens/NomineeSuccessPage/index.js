import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { useNavigation, } from '@react-navigation/native';
import { CommonStyles } from '../../Themes/CommonStyles';
import { NomineeThirdProgress, SuccessImg } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const NomineeSuccessPage = () => {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={CommonStyles.container}>
      <CustomHeader
        title="Edit KYC"
        showBack={true}
      />
      <NomineeThirdProgress style={styles.progressbarStyle} />
      <SuccessBox
        title={'Your KYC has been Updated'}
        ImageComponent={SuccessImg}
        buttonTitle={'Let’s Continue'}
        messageText="KYC received. We’ll reach out if needed."
        onPress={handleEdit}
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

export default NomineeSuccessPage;
