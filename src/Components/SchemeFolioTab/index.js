import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const SchemeFolioTab = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onTabChange('Scheme')}>
        <Text allowFontScaling={false}
          style={[
            styles.tabText,
            activeTab === 'Scheme' && styles.activeText
          ]}
        >
          Scheme
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabChange('Folio')}>
        <Text allowFontScaling={false}
          style={[
            styles.tabText,
            activeTab === 'Folio' && styles.activeText
          ]}
        >
          Folio
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(2)
  },
  tabText: {
    fontSize: 18,
    fontFamily: Fonts.Semibold700,
    color: Colors.skyblue,
    marginRight: responsiveWidth(5)
  },
  activeText: {
    color: Colors.newPurple,
    textDecorationLine: 'underline'
  },

});

export default SchemeFolioTab;
