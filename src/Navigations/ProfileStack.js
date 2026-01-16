import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Screens/Profile';
import EditProfile from '../Screens/EditProfile';
import ProfileDetails from '../Screens/ProfileDetails';
import BankDetailsFirstForm from '../Screens/BankDetailsFirstForm'
import BankDetailsSuccessPage from '../Screens/BankDetailsSuccessPage'
import NomineeDetails from '../Screens/NomineeDetails'
import EditNominee from '../Screens/EditNominee'
import EditAddresNominee from '../Screens/EditAddresNominee'
import NomineeSuccessPage from '../Screens/NomineeSuccessPage'
import EditKyc from '../Screens/EditKyc'
import EditOtherDetails from '../Screens/EditOtherDetails'
import EditContactDetails from '../Screens/EditContactDetails'
import ContactDetails from '../Screens/ContactDetails'
import OtherDetails from '../Screens/OtherDetails'
import AddReferralDetails from '../Screens/AddReferralDetails'
import ReferalDetails from '../Screens/ReferalDetails'
import ReferralSuccessPage from '../Screens/ReferralSuccessPage'
import ReferralList from '../Screens/ReferralList';
import InteractionDetails from '../Screens/InteractionDetails';
import AboutUsPage from '../Screens/AboutUsPage';
import EditGuardianDetails from '../Screens/EditGuardianDetails';
import EditGuardianAddress from '../Screens/EditGuardianAddress';


const ProfileStackNav = createStackNavigator();

export const ProfileStack = (props) => {
    return (
        <ProfileStackNav.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
            }}
        >
            <ProfileStackNav.Screen name="Profile" component={Profile} />
            <ProfileStackNav.Screen name="ProfileDetails" component={ProfileDetails} />
            <ProfileStackNav.Screen name="EditProfile" component={EditProfile} />
            <ProfileStackNav.Screen name="BankDetailsFirstForm" component={BankDetailsFirstForm} />
            <ProfileStackNav.Screen name="BankDetailsSuccessPage" component={BankDetailsSuccessPage} />
            <ProfileStackNav.Screen name="NomineeDetails" component={NomineeDetails} />
            <ProfileStackNav.Screen name="EditNominee" component={EditNominee} />
            <ProfileStackNav.Screen name="EditAddresNominee" component={EditAddresNominee} />
            <ProfileStackNav.Screen name="NomineeSuccessPage" component={NomineeSuccessPage} />
            <ProfileStackNav.Screen name="EditKyc" component={EditKyc} />
            <ProfileStackNav.Screen name="EditOtherDetails" component={EditOtherDetails} />
            <ProfileStackNav.Screen name="EditContactDetails" component={EditContactDetails} />
            <ProfileStackNav.Screen name="ContactDetails" component={ContactDetails} />
            <ProfileStackNav.Screen name="OtherDetails" component={OtherDetails} />
            <ProfileStackNav.Screen name="AddReferralDetails" component={AddReferralDetails} />
            <ProfileStackNav.Screen name="ReferalDetails" component={ReferalDetails} />
            <ProfileStackNav.Screen name="ReferralSuccessPage" component={ReferralSuccessPage} />
            <ProfileStackNav.Screen name="ReferralList" component={ReferralList} />
            <ProfileStackNav.Screen name="InteractionDetails" component={InteractionDetails} />
            <ProfileStackNav.Screen name="AboutUsPage" component={AboutUsPage} />
            <ProfileStackNav.Screen name="EditGuardianDetails" component={EditGuardianDetails} />
            <ProfileStackNav.Screen name="EditGuardianAddress" component={EditGuardianAddress} />
        </ProfileStackNav.Navigator>
    );
}
export default ProfileStack