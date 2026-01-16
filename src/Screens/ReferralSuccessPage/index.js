import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { useNavigation, useRoute} from '@react-navigation/native';
import { CommonStyles } from '../../Themes/CommonStyles';
import { NomineeThirdProgress, ReferalSuccessProgress, SuccessImg } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const ReferralSuccessPage = () => {
  const navigation = useNavigation();
    const route = useRoute();
    const result = route.params.result;

  const handleEdit = () => {
    navigation.navigate('Profile');

  };
   const firstName = result?.response?.firstname || ''; 
    const lastName = result?.response?.lastname || '';
  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="Add New Referral" showBack />
      <ReferalSuccessProgress style={styles.progressbarStyle} />
      <SuccessBox
        title={'Thank you for the reference!'}
        ImageComponent={SuccessImg}
        buttonTitle={'Let’s Continue'}
     messageText={`Our team member will contact to ${firstName} ${lastName} at the earliest.`}
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

export default ReferralSuccessPage;
