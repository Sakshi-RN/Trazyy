import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActiveInsurance, InsuranceIcon, HomeIcon, PartnershipIcon, Peopleusers, ActiveProfile, Activepartner, Activehome } from '../Assets/svg';
import HomeStack from '../Navigations/HomeStack';
import ProfileStack from '../Navigations/ProfileStack';
import SIPStack from './SIPStack';
import LumpsumpStack from './LumpsumpStack';
import Colors from '../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';


const Tab = createBottomTabNavigator();

export default function BTabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName='HomeStack'
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: { ...styles.tabBarStyle },
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      <Tab.Screen
        name='Home'
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <Activehome /> : <HomeIcon />,
        }}
      />

      <Tab.Screen
        name='SIP'
        component={SIPStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <Activepartner /> : <PartnershipIcon />,
        }}
      />
      <Tab.Screen
        name='Lumpsump'
        component={LumpsumpStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveInsurance /> : <InsuranceIcon />,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <ActiveProfile /> : <Peopleusers />,
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.white,
    paddingTop: responsiveHeight(2),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? responsiveHeight(10) : responsiveHeight(13.5),
    borderTopColor: Colors.lightGrey,
    borderTopWidth: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 15,
  },
});
