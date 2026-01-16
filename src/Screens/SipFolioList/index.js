import { View, StyleSheet } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPFirstprogress } from '../../Assets/svg';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import FolioList from '../../Components/FolioList';


const SipFolioList = () => {
  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
      <CustomHeader title="SIP Purchase" showBack  />
      <SIPFirstprogress style={styles.progressbarStyle} />
      <FolioList/>
    </View>
  );
};

const styles = StyleSheet.create({
   row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    backgroundColor: 'red'
  },

  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
 

});

export default SipFolioList;
