import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { FailuresImg, OneTimeFailure, SuccessImg, SipSuccessProgress } from '../../Assets/svg';
import SuccessBox from '../../Components/SuccessBox';
import { useRoute, useNavigation } from '@react-navigation/native';

const SIPSuccessPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { purchase_ids } = route.params || {};


  const renderSuccessView = () => (
    <View>
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

  const renderUnSuccessView = () => (
    <View>
      <OneTimeFailure style={styles.progressbarStyle} />
      <SuccessBox
        title="Investment unsuccessful"
        ImageComponent={FailuresImg}
        buttonTitle={'Retry'}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SIPFirstForm' }]
          });
        }}
      />
    </View>
  );

  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="SIP Purchase" showBack={false} />
      {purchase_ids && purchase_ids.length > 0 ? (
        renderSuccessView()
      ) : (
        renderUnSuccessView()
      )}
    </View>
  );
};

export default SIPSuccessPage;

const styles = StyleSheet.create({
  progressbarStyle: {
    marginTop: 20,
    alignSelf: 'center',
  }
});