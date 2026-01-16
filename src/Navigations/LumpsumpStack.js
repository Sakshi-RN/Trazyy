import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import OneTimeFirstForm from '../Screens/OneTimeFirstForm';
import OneTimeSecondForm from '../Screens/OneTimeSecondForm';
import OneTimeThirdForm from '../Screens/OneTimeThirdForm';
import OneTimeSucessPage from '../Screens/OneTimeSucessPage';
import LumpSumAmountPage from '../Screens/LumpSumAmountPage';
import LumpSumpOtpVerify from '../Screens/LumpSumpOtpVerify';
import CommonSuccessPage from '../Screens/CommonSuccessPage';

const LumpsumpStackNav = createStackNavigator();

export const LumpsumpStack = (props) => {
    return (
        <LumpsumpStackNav.Navigator
            initialRouteName="OneTimeFirstForm"
            screenOptions={{
                headerShown: false,
            }}
        >

            <LumpsumpStackNav.Screen name="OneTimeFirstForm" component={OneTimeFirstForm} />
            <LumpsumpStackNav.Screen name="OneTimeSecondForm" component={OneTimeSecondForm} />
            <LumpsumpStackNav.Screen name="OneTimeThirdForm" component={OneTimeThirdForm} />
            <LumpsumpStackNav.Screen name="OneTimeSucessPage" component={OneTimeSucessPage} />
            <LumpsumpStackNav.Screen name="LumpSumAmountPage" component={LumpSumAmountPage} />
            <LumpsumpStackNav.Screen name="LumpSumpOtpVerify" component={LumpSumpOtpVerify} />
            <LumpsumpStackNav.Screen name="CommonSuccessPage" component={CommonSuccessPage} />
        </LumpsumpStackNav.Navigator>
    );
}
export default LumpsumpStack;