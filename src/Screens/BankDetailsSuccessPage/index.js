import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { useNavigation, } from '@react-navigation/native';
import { BankThirdProgress, SuccessImg } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const BankDetailsSuccessPage = () => {

  const navigation = useNavigation();
  const handleEdit = () => {
    navigation.navigate('Profile');

  };

  return (
    <View style={CommonStyles.container}>
      <CustomHeader
        title="Bank Details"
        showBack={true}
      />
      <BankThirdProgress style={styles.progressbarStyle} />
        <SuccessBox
          title="Success"
          ImageComponent={SuccessImg}
          buttonTitle={'Explore More'}
          messageText="Your bank details has been added successfully."
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

export default BankDetailsSuccessPage;
