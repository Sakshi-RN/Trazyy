import { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartCountProvider } from '../utils/CartCountContext';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from '../Screens/Welcome';
import Login from '../Screens/Login';
import RegisterationForm from '../Screens/RegisterationForm';
import SignUpEmailOtpVerify from '../Screens/SignUpEmailOtpVerify';
import SignUpPhoneOtpVerify from '../Screens/SignUpPhoneOtpVerify';
import LoginOtpVerify from '../Screens/LoginOtpVerify';
import ForgotPassword from '../Screens/ForgotPassword';
import ResetPasswOtpVerify from '../Screens/ResetPasswOtpVerify';
import ChangePassword from '../Screens/ChangePassword';
import BTabNavigation from '../Navigations/BTabNavigation';
import LoginWelcome from '../Screens/LoginWelcome';
import OTPVerifiedSuccess from '../Screens/OTPVerifiedSuccess';



const Stack = createStackNavigator();

export default function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigationRef = useRef(null);
  const routeNameRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const clientID = await AsyncStorage.getItem('clientID');
        setIsLoggedIn(!!clientID);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) return null;

  return (
    <CartCountProvider>
      <NavigationContainer
        ref={navigationRef}
      >
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={isLoggedIn ? 'BTabNavigation' : 'Welcome'}
        >
          <Stack.Screen name="BTabNavigation" component={BTabNavigation} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegisterationForm" component={RegisterationForm} />
          <Stack.Screen name="SignUpEmailOtpVerify" component={SignUpEmailOtpVerify} />
          <Stack.Screen name="SignUpPhoneOtpVerify" component={SignUpPhoneOtpVerify} />
          <Stack.Screen name="LoginOtpVerify" component={LoginOtpVerify} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPasswOtpVerify" component={ResetPasswOtpVerify} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="LoginWelcome" component={LoginWelcome} />
          <Stack.Screen name="OTPVerifiedSuccess" component={OTPVerifiedSuccess} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartCountProvider>
  );
}
