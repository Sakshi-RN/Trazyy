import { createStackNavigator } from '@react-navigation/stack';
import SIPFirstForm from '../Screens/SIPFirstForm';
import SIPSecondForm from '../Screens/SIPSecondForm';
import SIPNewForm from '../Screens/SIPNewForm';
import SIPConsentForm from '../Screens/SIPConsentForm';
import SIPOtpVerify from '../Screens/SIPOtpVerify';
import SIPSuccessPage from '../Screens/SIPSuccessPage';
import CommonSuccessPage from '../Screens/CommonSuccessPage';

const SIPStackNav = createStackNavigator();

export const SIPStack = (props) => {
    return (
        <SIPStackNav.Navigator
            initialRouteName="SIPFirstForm"
            screenOptions={{
                headerShown: false,
            }}
        >
            <SIPStackNav.Screen name="SIPFirstForm" component={SIPFirstForm} />
            <SIPStackNav.Screen name="SIPSecondForm" component={SIPSecondForm} />
            <SIPStackNav.Screen name="SIPNewForm" component={SIPNewForm} />
            <SIPStackNav.Screen name="SIPConsentForm" component={SIPConsentForm} />
            <SIPStackNav.Screen name="SIPOtpVerify" component={SIPOtpVerify} />
            <SIPStackNav.Screen name="SIPSuccessPage" component={SIPSuccessPage} />
            <SIPStackNav.Screen name="CommonSuccessPage" component={CommonSuccessPage} />
        </SIPStackNav.Navigator>
    );
}
export default SIPStack;