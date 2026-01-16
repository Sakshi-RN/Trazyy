import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';

const MyFundsTab = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab.key} 
          onPress={() => {
            setActiveTab(tab.key);
            tab.action && tab.action();
          }}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeText
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
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
    color: Colors.black,
    marginRight: responsiveWidth(5)
  },
  activeText: {
    color: Colors.newPurple,
    textDecorationLine: 'underline'
  }
});

export default MyFundsTab;
