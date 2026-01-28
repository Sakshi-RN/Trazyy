import React from 'react';
import { View, StyleSheet } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import CustomHeader from '../../Components/CustomHeader';
import { WebView } from 'react-native-webview';

const AsperoWebView = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <CustomHeader title="" showBack={true} />
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default AsperoWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: responsiveHeight(3)
  },
});
