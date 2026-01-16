import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import {
  View, StyleSheet, Text, TouchableOpacity, Platform, Modal, TextInput, Keyboard, TouchableWithoutFeedback,
  KeyboardAvoidingView, Alert, Linking
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../Themes/Colors';
import { HealthImg, InsuranceHealth, InsuranceLife, InsuranceMotor, LifeImg, MotorImg, OtherImg } from '../../Assets/svg';
import CustomBackButton from '../../Components/CustomBackButton';
import CustomButton from '../../Components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import ServiceBox from '../../Components/ServiceBox';
import { Fonts } from '../../Themes/Fonts';
import getEnvVars from '../../utils/config';


const InsuranceContainer = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [otherInsuranceText, setOtherInsuranceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
      const { baseURL, endpoints } = getEnvVars();

  const services = [
    { id: '0', Component: HealthImg, label: 'Health' },
    { id: '1', Component: LifeImg, label: 'Life' },
    { id: '2', Component: MotorImg, label: 'Motor' },
    { id: '3', Component: OtherImg, label: 'Other' },
  ];
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTextChange = (text) => {
    if (text.length <= 250) {
      setError(false);
      setOtherInsuranceText(text);
    } else {
      setError(true);
    }
  };

  const callApi = async (product) => {
    try {
      const ClientId = await AsyncStorage.getItem("clientID");
      if (!ClientId) {
        console.warn("⚠️ No client ID found in AsyncStorage");
        return;
      }

      const body = {
        clientId: Number(ClientId),
        type: "b2c",
        vendor: "zopper",
        product: product,
      };


      const response = await fetch(
       `${baseURL}${endpoints.INSURANCE}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const jsonResponse = await response.json();

      if (jsonResponse.status) {
        if (jsonResponse.response?.status === 200) {
          const redirectionUrl = jsonResponse.response.data?.redirection_url;
          if (redirectionUrl) {
            Linking.openURL(redirectionUrl).catch((err) =>
              console.error("❌ Error opening URL:", err)
            );
          } else {
            Alert.alert("Error", "Redirection URL not found in response.");
          }
        }
    else if (jsonResponse.response?.status === 400) {
  Alert.alert(
    "Action Required",
    "KYC details are pending.",
    [
      {
        text: "OK",
        onPress: () => navigation.navigate("NomineeDetails"), 
      }
    ],
    { cancelable: false }
  );
}
        else {
          const errorMessage =
            jsonResponse.response?.message || "Unexpected server response.";
          Alert.alert("Error", errorMessage);
        }
      } else {
        const errorMessage =
          jsonResponse.statusMessage || "Server Error. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("🌐 Network Error (Wrapper API):", error.message);
      Alert.alert("Error", "Unable to process the request. Please try again later.");
    }
  };

  const callOtherInsuranceApi = async () => {
    if (!otherInsuranceText.trim()) {
      Alert.alert("Warning", "Please enter Other insurance");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "No token found");
        setLoading(false);
        return;
      }
      const ClientId = await AsyncStorage.getItem("clientID");
      const managerId = await AsyncStorage.getItem("managerID");

      if (!ClientId || !managerId) {
        console.warn("⚠️ Missing clientID or managerID in AsyncStorage");
        setLoading(false);
        return;
      }

      const body = {
        requestedBy: Number(ClientId),
        otherInsurance: otherInsuranceText,
        managerId: Number(managerId),
      };
      const response = await fetch(
     `${baseURL}${endpoints.OTHERR_INSURANCE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Token": token,
          },
          body: JSON.stringify(body),
        }
      );

      const jsonResponse = await response.json();
      if (jsonResponse.status && jsonResponse.response?.status) {
        Alert.alert("Success", jsonResponse.response.message);
        toggleModal();
        setOtherInsuranceText("");
      } else {
        const errorMessage =
          jsonResponse.response?.message ||
          "Something went wrong, please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("🌐 Network Error (Other Insurance):", error.message);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  const ServicesMenu = () => {

    return (
      <View>
        <Text allowFontScaling={false} style={styles.heading}>Purchase your Insurance Plan</Text>
        <View style={styles.row}>
          <ServiceBox
            title="Health"
            SvgIcon={HealthImg}
            borderColor={Colors.yellow}
            width={responsiveWidth(20)}
            marginHorizontal={responsiveWidth(0.2)}
            onPress={() => callApi("health")} />
          <ServiceBox
            title="Life"
            SvgIcon={LifeImg}
            borderColor={Colors.newBlue}
            width={responsiveWidth(20)}
            marginHorizontal={responsiveWidth(1.5)}
            onPress={() => callApi("life")} />
          <ServiceBox
            title="Motor"
            SvgIcon={MotorImg}
            borderColor={Colors.borderRed}
            width={responsiveWidth(20)}
            marginHorizontal={responsiveWidth(1.5)}
            onPress={() => callApi("motor")} />
          <ServiceBox
            title="Other"
            svgMarginRight={-3}
            SvgIcon={OtherImg}
            borderColor={Colors.purple}
            width={responsiveWidth(20)}
            marginHorizontal={responsiveWidth(0.5)}
            onPress={toggleModal}
          />
        </View>
        <Text allowFontScaling={false} style={styles.heading}>Exclusive offers</Text>
        <View>
          <TouchableOpacity onPress={() => callApi("health")} >
            <InsuranceHealth width={370} height={150} style={styles.bannerStyle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => callApi("life")} style={styles.insuranceBtn}>
            <InsuranceLife width={370} height={150} style={styles.bannerStyle} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => callApi("motor")} style={styles.thirdBtn}>
            <InsuranceMotor width={370} height={150} style={styles.bannerStyle} />
          </TouchableOpacity>
        </View>
      </View>

    )
  };

  const modalContainer = () => {

    return (
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
          }}>

            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text allowFontScaling={false} style={styles.modalTitle}>
                  Please enter the other insurance that you would like to purchase.
                </Text>
                <View style={[styles.textInput]}>
                  <TextInput
                    allowFontScaling={false}
                    style={styles.inputStyle}
                    placeholder="Type here..."
                    value={otherInsuranceText}
                    onChangeText={handleTextChange}
                    multiline={true}
                    placeholderTextColor={Colors.grey}
                  />
                </View>
                <Text allowFontScaling={false} style={styles.sizeText}>
                  {`${otherInsuranceText.length}/250`}
                </Text>

                <View style={styles.referralRow}>
                  <CustomBackButton
                    title={'Cancel'}
                    onPress={toggleModal}
                  />
                  <CustomButton
                    title={loading ? <Loader /> : "Submit"}
                    onPress={callOtherInsuranceApi}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <ServicesMenu />
      {modalContainer()}
    </View>
  );
};

const styles = StyleSheet.create({

  name: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    width: responsiveWidth(70),
    top: responsiveHeight(-20),
    marginLeft: responsiveWidth(5)
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: responsiveWidth(5),
    width: responsiveWidth(57),
    paddingTop: Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(3),
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
    alignSelf: 'center',
    color: Colors.white
  },
  mainContainer: {
    marginHorizontal: responsiveWidth(3),
    top: Platform.OS === 'ios' ? responsiveHeight(-12) : responsiveHeight(-14)
  },

  itemContainer: {
    marginHorizontal: responsiveWidth(2.5),
    width: responsiveWidth(16),
    marginTop: responsiveHeight(2),
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(15),
    height: responsiveHeight(6.5),
    borderRadius: 8,
    shadowColor: Colors.grey,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
    backgroundColor: '#DFF1FF'
  },
  label: {
    fontSize: responsiveFontSize(1),
    color: Colors.black,
    fontWeight: '500',
    marginTop: responsiveHeight(1.3),
    alignSelf: 'center',
    width: responsiveWidth(22),
    textAlign: 'center'
  },
  itemtitle: {
    color: Colors.black,
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
    marginLeft: responsiveWidth(4),
    marginTop: responsiveHeight(1.5)

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
    width: 'auto'
  },
  new: {
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    backgroundColor: Colors.OFFWHITE,
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1.5),

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: responsiveHeight(3)
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: Fonts.Semibold700,
    textAlign: 'center',
    color: Colors.blue
  },
  textInput: {
    height: responsiveHeight(14),
    borderColor: Colors.blue,
    borderWidth: 1.5,
    borderRadius: 6,
    padding: 10,
    marginTop: responsiveHeight(2),

  },
  inputStyle: {
    fontSize: 14,
    fontFamily: Fonts.Medium600,
    color: Colors.blue
  },
  submitButton: {
    alignSelf: 'center',
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 10,
  },
  sizeText: {
    fontSize: 12,
    fontFamily: Fonts.Semibold700,
    color: Colors.grey
  },
  bannerStyle: { width: '100%', marginTop: responsiveHeight(1) },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(3),
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
    fontFamily: Fonts.Semibold700,
    color: Colors.black,
  },
  insuranceBtn: {
    top: responsiveHeight(-3),
  },
  thirdBtn: {
    top: responsiveHeight(-6),

  },
  bannerStyle: {
    alignSelf: 'center'
  }
});

export default InsuranceContainer;
