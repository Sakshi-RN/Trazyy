import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home'
import EditProfile from '../Screens/EditProfile';
import ProfileDetails from '../Screens/ProfileDetails';
import BankDetailsFirstForm from '../Screens/BankDetailsFirstForm'
import BankDetailsSuccessPage from '../Screens/BankDetailsSuccessPage'
import OneTimeFirstForm from '../Screens/OneTimeFirstForm'
import LumpSumAmountPage from '../Screens/LumpSumAmountPage'
import OneTimeSecondForm from '../Screens/OneTimeSecondForm'
import OneTimeThirdForm from '../Screens/OneTimeThirdForm'
import OneTimeSucessPage from '../Screens/OneTimeSucessPage'
import SIPFirstForm from '../Screens/SIPFirstForm'
import SIPNewForm from '../Screens/SIPNewForm'
import SIPSecondForm from '../Screens/SIPSecondForm'
import SIPSuccessPage from '../Screens/SIPSuccessPage'
import OrderPage from '../Screens/OrderPage'
import SIPConsentForm from '../Screens/SIPConsentForm'
import RedeemPage from '../Screens/RedeemPage'
import CapitalGain from '../Screens/CapitalGain'
import STPDetails from '../Screens/STPDetails'
import SWPDetails from '../Screens/SWPDetails'
import NomineeDetails from '../Screens/NomineeDetails'
import EditNominee from '../Screens/EditNominee'
import EditAddresNominee from '../Screens/EditAddresNominee'
import NomineeSuccessPage from '../Screens/NomineeSuccessPage'
import EditKyc from '../Screens/EditKyc'
import LumpsumpFolioList from '../Screens/LumpsumpFolioList'
import LumpSumpOtpVerify from '../Screens/LumpSumpOtpVerify'
import RedeemSubmitForm from '../Screens/RedeemSubmitForm'
import RedeemAmountOtpVerify from '../Screens/RedeemAmountOtpVerify'
import SipNewListScreen from '../Screens/SipNewListScreen'
import SIPOtpVerify from '../Screens/SIPOtpVerify'
import SipFolioList from '../Screens/SipFolioList'
import ContactDetails from '../Screens/ContactDetails'
import EditContactDetails from '../Screens/EditContactDetails'
import MyCart from '../Screens/MyCart'
import FatcaDetails from '../Screens/FatcaDetails';
import AboutUsPage from '../Screens/AboutUsPage';
import SignatureUpload from '../Screens/SignatureUpload';
import PersonalDetails from '../Screens/PersonalDetails';
import AadhaarVerificationMsg from '../Screens/AadhaarVerificationMsg';
import ESignVerificationMsg from '../Screens/ESignVerificationMsg';
import KYCSuccess from '../Screens/KYCSuccess';
import ReferralList from '../Screens/ReferralList';
import InteractionDetails from '../Screens/InteractionDetails';
import AddReferralDetails from '../Screens/AddReferralDetails';
import ReferalDetails from '../Screens/ReferalDetails';
import ReferralSuccessPage from '../Screens/ReferralSuccessPage';
import CommonSuccessPage from '../Screens/CommonSuccessPage'
import LarkWebView from '../Screens/LarkWebView';
import MutualFund from '../Screens/MutualFund';
import HiAiSays from '../Screens/HiAiSays';
import TrazyyUniversity from '../Screens/TrazyyUniversity';



const HomeStackNav = createStackNavigator();

export const HomeStack = (props) => {
    return (
        <HomeStackNav.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }} >
            <HomeStackNav.Screen name="Home" component={Home} />
            <HomeStackNav.Screen name="OneTimeFirstForm" component={OneTimeFirstForm} />
            <HomeStackNav.Screen name="OneTimeSecondForm" component={OneTimeSecondForm} />
            <HomeStackNav.Screen name="OneTimeThirdForm" component={OneTimeThirdForm} />
            <HomeStackNav.Screen name="OneTimeSucessPage" component={OneTimeSucessPage} />
            <HomeStackNav.Screen name="SIPFirstForm" component={SIPFirstForm} />
            <HomeStackNav.Screen name="SIPSuccessPage" component={SIPSuccessPage} />
            <HomeStackNav.Screen name="SIPSecondForm" component={SIPSecondForm} />
            <HomeStackNav.Screen name="OrderPage" component={OrderPage} />
            <HomeStackNav.Screen name="SIPConsentForm" component={SIPConsentForm} />
            <HomeStackNav.Screen name="SIPNewForm" component={SIPNewForm} />
            <HomeStackNav.Screen name="LumpSumAmountPage" component={LumpSumAmountPage} />
            <HomeStackNav.Screen name="RedeemPage" component={RedeemPage} />
            <HomeStackNav.Screen name="CapitalGain" component={CapitalGain} />
            <HomeStackNav.Screen name="STPDetails" component={STPDetails} />
            <HomeStackNav.Screen name="SWPDetails" component={SWPDetails} />
            <HomeStackNav.Screen name="NomineeDetails" component={NomineeDetails} />
            <HomeStackNav.Screen name="EditNominee" component={EditNominee} />
            <HomeStackNav.Screen name="EditAddresNominee" component={EditAddresNominee} />
            <HomeStackNav.Screen name="NomineeSuccessPage" component={NomineeSuccessPage} />
            <HomeStackNav.Screen name="EditKyc" component={EditKyc} />
            <HomeStackNav.Screen name="LumpsumpFolioList" component={LumpsumpFolioList} />
            <HomeStackNav.Screen name="LumpSumpOtpVerify" component={LumpSumpOtpVerify} />
            <HomeStackNav.Screen name="RedeemSubmitForm" component={RedeemSubmitForm} />
            <HomeStackNav.Screen name="RedeemAmountOtpVerify" component={RedeemAmountOtpVerify} />
            <HomeStackNav.Screen name="SipNewListScreen" component={SipNewListScreen} />
            <HomeStackNav.Screen name="SIPOtpVerify" component={SIPOtpVerify} />
            <HomeStackNav.Screen name="SipFolioList" component={SipFolioList} />
            <HomeStackNav.Screen name="BankDetailsFirstForm" component={BankDetailsFirstForm} />
            <HomeStackNav.Screen name="EditProfile" component={EditProfile} />
            <HomeStackNav.Screen name="ProfileDetails" component={ProfileDetails} />
            <HomeStackNav.Screen name="BankDetailsSuccessPage" component={BankDetailsSuccessPage} />
            <HomeStackNav.Screen name="ContactDetails" component={ContactDetails} />
            <HomeStackNav.Screen name="EditContactDetails" component={EditContactDetails} />
            <HomeStackNav.Screen name="MyCart" component={MyCart} />
            <HomeStackNav.Screen name="PersonalDetails" component={PersonalDetails} />
            <HomeStackNav.Screen name="FatcaDetails" component={FatcaDetails} />
            <HomeStackNav.Screen name="AboutUsPage" component={AboutUsPage} />
            <HomeStackNav.Screen name="SignatureUpload" component={SignatureUpload} />
            <HomeStackNav.Screen name="AadhaarVerificationMsg" component={AadhaarVerificationMsg} options={{ gestureEnabled: false }} />
            <HomeStackNav.Screen name="ESignVerificationMsg" component={ESignVerificationMsg} options={{ gestureEnabled: false }} />
            <HomeStackNav.Screen name="KYCSuccess" component={KYCSuccess} options={{ gestureEnabled: false }} />
            <HomeStackNav.Screen name="ReferralList" component={ReferralList} />
            <HomeStackNav.Screen name="InteractionDetails" component={InteractionDetails} />
            <HomeStackNav.Screen name="AddReferralDetails" component={AddReferralDetails} />
            <HomeStackNav.Screen name="ReferalDetails" component={ReferalDetails} />
            <HomeStackNav.Screen name="ReferralSuccessPage" component={ReferralSuccessPage} />
            <HomeStackNav.Screen name="LarkWebView" component={LarkWebView} />
            <HomeStackNav.Screen name="CommonSuccessPage" component={CommonSuccessPage} />
            <HomeStackNav.Screen name="MutualFund" component={MutualFund} />
            <HomeStackNav.Screen name="HiAiSays" component={HiAiSays} />
            <HomeStackNav.Screen name="TrazyyUniversity" component={TrazyyUniversity} />
        </HomeStackNav.Navigator>
    );
}
export default HomeStack