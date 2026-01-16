import {
  View,
  StyleSheet
} from 'react-native';
import React, { useState } from 'react';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../../Themes/Fonts';
import { CommonStyles } from '../../Themes/CommonStyles';
import CustomHeader from '../../Components/CustomHeader';
import CustomButton from '../../Components/CustomButton';
import MyCartListContainer from '../../Components/MyCartListContainer';
import { useFocusEffect } from '@react-navigation/native'; 

const MyCart = () => {

  const [sipCount, setSipCount] = useState(0);
  const [lumpsumCount, setLumpsumCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedTab, setSelectedTab] = useState('sip');

  const activeTabColor = Colors.lightblue;
  const inactiveTabColor = Colors.white;

  useFocusEffect(
    React.useCallback(() => {
      setRefreshTrigger(prev => prev + 1);
    }, [])
  );
  
  return (
    <View style={CommonStyles.container}>
      <CustomHeader title="My Cart" showBack={true} />
      <View style={styles.row}>
        <CustomButton
          title={`SIP (${sipCount})`}
          buttonStyle={[
            styles.btn,
            {
              backgroundColor: selectedTab === 'sip' ? activeTabColor : inactiveTabColor
            }
          ]}
          onPress={() => setSelectedTab('sip')}
        />
        <CustomButton
          title={`Lumpsum (${lumpsumCount})`}
          buttonStyle={[
            styles.btn,
            {
              backgroundColor: selectedTab === 'lumpsum' ? activeTabColor : inactiveTabColor
            }
          ]} onPress={() => setSelectedTab('lumpsum')}
        />
      </View>
      <MyCartListContainer
        trxType={selectedTab}
        refreshTrigger={refreshTrigger} 
        onCountFetched={(sip, lumpsum) => {
          setSipCount(sip);
          setLumpsumCount(lumpsum);
        }}
      />

    </View>
  );
};


export default MyCart;

const styles = StyleSheet.create({

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    marginHorizontal: responsiveWidth(6)
  },

  btn: {
    width: responsiveWidth(38),
    paddingHorizontal: responsiveWidth(5),
  },
  secureNowText: {
    color: Colors.newGreen
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(6)
  },
  noDataText: {
    fontFamily: Fonts.Semibold700,
    fontSize: 16,
    color: Colors.blue,
    marginTop: responsiveHeight(2),
    alignSelf: 'center'
  },
  box: {
    paddingVertical: responsiveHeight(3),
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3)
  }
});


