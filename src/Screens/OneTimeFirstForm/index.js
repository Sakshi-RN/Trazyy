import { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { Firstprogress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ModalDropdown from '../../Components/ModalDropdown';
import Colors from '../../Themes/Colors';
import { Fonts } from '../../Themes/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import * as Linking from 'expo-linking';
import CustomBackButton from '../../Components/CustomBackButton';
import getEnvVars from '../../utils/config';

const OneTimeFirstForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();


  // Initialize or reset states
  const [folioType, setFolioType] = useState('new');
  const [selectedAmc, setSelectedAmc] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [investmentOption, setInvestmentOption] = useState('');
  const [selectedMandate, setSelectedMandate] = useState(null);
  const [schemePage, setSchemePage] = useState(1);
  const [schemeLastPage, setSchemeLastPage] = useState(false);
  const [schemeLoadingMore, setSchemeLoadingMore] = useState(false);


  const [amcList, setAmcList] = useState([]);

  const [schemeList, setSchemeList] = useState([]);

  const [showAmcModal, setShowAmcModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [amcLoading, setAmcLoading] = useState(false);
  const [folioLoading, setFolioLoading] = useState(false);
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [mandateList, setMandateList] = useState([]);
  const [isPrefilled, setIsPrefilled] = useState(false);


  useEffect(() => {
    if (route.params?.existingFolio) {
      const ef = route.params.existingFolio;

      setIsPrefilled(true);

      setSelectedMandate({
        label: ef.number,
        value: ef.number,
      });

      setSelectedAmc({
        label: ef.amc_name,
        value: ef.amc_id,
      });

      setSelectedScheme({
        label: ef.fund_scheme_name,
        value: ef.isin,
        fund_category: ef.fund_category,
        investment_option: ef.investment_option,
        minAmount: ef.min_initial_investment,
        maxAmount: ef.max_initial_investment,
      });

      setCategoryName(ef.fund_category || '');
      setInvestmentOption(ef.investment_option || '');
      setFolioType('existing');
    }
  }, [route.params?.existingFolio]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.resetForm) {
        setSelectedAmc(null);
        setSelectedScheme(null);
        setCategoryName('');
        setInvestmentOption('');
        setShowAmcModal(false);
        setShowSchemeModal(false);
        setSelectedMandate(null);
        setFolioType('new');
        setErrors({});
      }
    }, [route.params])
  );

  useEffect(() => {
    const handleDeepLink = (event) => {
      const parsedUrl = Linking.parse(event.url);
      if (parsedUrl.scheme === 'investek') {
        if (parsedUrl.path === 'investek://payment_success') {
          navigation.navigate('OneTimeSucessPage');
        } else if (parsedUrl.path === 'investek://payment_failure') {
          navigation.navigate('OneTimeSucessPage');
        }
      }
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const fetchFolios = async () => {
    try {
      setFolioLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage.');
        setMandateList([]);
        return;
      }

      const res = await axios.get(
        `${baseURL}${endpoints.GET_MF_FOLIOS}${ClientId}`
      );

      if (res.data?.response?.status && Array.isArray(res.data.response?.data)) {
        const folios = res.data.response.data.map(f => ({
          label: f.number,
          value: f.number,
        }));
        setMandateList(folios);
      } else {
        setMandateList([]);
      }
    } catch (error) {
      console.error('Error fetching folios:', error);
      setMandateList([]);
    } finally {
      setFolioLoading(false);
    }
  };

  useEffect(() => {
    fetchFolios();
    fetchAmcList();
  }, []);

  const fetchAmcList = async () => {
    try {
      setAmcLoading(true);
      setAmcLoading(true);
      const response = await axios.get(
        `${baseURL}${endpoints.GET_AMCS_LIST}`
      );
      const data = response.data.response?.data || [];
      const formatted = data.map(item => ({
        label: item.amc_name,
        value: item.amc_id,
      }));
      setAmcList(formatted);
    } catch (error) {
      console.error('AMC List Error:', error);
    } finally {
      setAmcLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchFundSchemes = async (amcId, page = 0, isFirstLoad = false, query = '') => {
    try {
      isFirstLoad ? setSchemeLoading(true) : setSchemeLoadingMore(true);

      let url = `${baseURL}${endpoints.GET_FUND_SCHEMES}${amcId}?page=${page}&size=100`;
      if (query) {
        url += `&name=${encodeURIComponent(query)}`;
      }

      const response = await axios.get(url);

      const res = response.data.response;
      const data = res?.data || [];

      const formatted = data.map(item => ({
        label: item.fund_scheme_name,
        value: item.isin,
        fund_category: item.fund_category,
        investment_option: item.investment_option,
        minAmount: Number(item.min_initial_investment),
        maxAmount: Number(item.max_initial_investment),
      }));

      setSchemeList(prev =>
        page === 0 ? formatted : [...prev, ...formatted]
      );

      setSchemeLastPage(res.last);
      setSchemePage(page);
    } catch (error) {
      console.error('Fund Scheme Error:', error);
    } finally {
      setSchemeLoading(false);
      setSchemeLoadingMore(false);
    }
  };


  const handleSelectAmc = (item) => {
    setSelectedAmc(item);
    setSelectedScheme(null);
    setCategoryName('');
    setInvestmentOption('');

    setSchemeList([]);
    setSchemePage(0);
    setSchemeLastPage(false);
    setSearchQuery(''); // Reset search query

    fetchFundSchemes(item.value, 0, true);
    setShowAmcModal(false);
  };

  const handleSchemeSearch = (text) => {
    setSearchQuery(text);
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      setSchemePage(0);
      setSchemeList([]);
      setSchemeLastPage(false);
      fetchFundSchemes(selectedAmc.value, 0, true, text);
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  };


  const handleSelectScheme = (item) => {
    setSelectedScheme(item);
    setCategoryName(item.fund_category);
    setInvestmentOption(item.investment_option);
    setShowSchemeModal(false);
  };

  const handleSelectMandate = (item) => {
    setSelectedMandate(item);
    setShowMandateModal(false);
  };

  const handleNext = () => {
    let tempErrors = {};
    if (!selectedAmc) tempErrors.selectedAmc = 'AMC is required.';
    if (!selectedScheme) tempErrors.selectedScheme = 'Scheme is required.';
    if (folioType === 'existing' && !selectedMandate)
      tempErrors.selectedMandate = 'Please select a Folio Number.';

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    const finalMandate =
      folioType === 'new' ? { label: 'New Folio', value: 'new' } : selectedMandate;


    navigation.navigate('LumpSumAmountPage', {
      selectedAmc,
      selectedScheme,
      categoryName,
      investmentOption,
      selectedMandate: finalMandate,
    });
  };

  const handleGoBack = () => navigation.goBack();

  const addReferalDetails = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[CommonStyles.containerBox, styles.scrollContentStyle]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomTextInput
              value={selectedAmc?.label || ''}
              placeholder="Select AMC Name"
              placeholderTextColor={Colors.grey}
              disabled={isPrefilled}
              // iconName="chevron-down"
              isDropdown={true}
              title={'AMC Name'}
              onPress={() => !isPrefilled && setShowAmcModal(true)}
            />
            {errors.selectedAmc && <Text allowFontScaling={false} style={styles.errorText}>{errors.selectedAmc}</Text>}

            <CustomTextInput
              value={selectedScheme?.label || ''}
              placeholder="Enter Scheme Name"
              placeholderTextColor={Colors.grey}
              iconColor={selectedAmc ? Colors.grey : Colors.NEWLIGHTGREY}
              // iconName="chevron-down"
              isDropdown={true}
              title={'Scheme Name'}
              disabled={isPrefilled || !selectedAmc}   // <-- UPDATED
              onPress={() => {
                if (!isPrefilled && selectedAmc) {
                  setShowSchemeModal(true);
                }
              }}
            />
            {errors.selectedScheme && <Text allowFontScaling={false} style={styles.errorText}>{errors.selectedScheme}</Text>}
            {!isPrefilled && (
              <View>
                <Text allowFontScaling={false} style={styles.titleText}>Select Folio Type</Text>
                <View style={styles.radioRow}>
                  <TouchableOpacity onPress={() => setFolioType('new')} style={styles.radioOption}>
                    <View style={[styles.radioOuter, folioType === 'new' && styles.radioSelectedOuter]}>
                      {folioType === 'new' && <View style={styles.radioInner} />}
                    </View>
                    <Text allowFontScaling={false} style={styles.radioLabel}>New Folio</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setFolioType('existing')} style={styles.radioOption}>
                    <View
                      style={[styles.radioOuter, folioType === 'existing' && styles.radioSelectedOuter]}>
                      {folioType === 'existing' && <View style={styles.radioInner} />}
                    </View>
                    <Text allowFontScaling={false} style={styles.radioLabel}>Existing Folio</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {folioType === 'existing' && (
              <>
                <CustomTextInput
                  placeholder="Select Folio Number"
                  // iconName="chevron-down"
                  isDropdown={true}
                  value={selectedMandate?.label || ''}
                  editable={false}
                  disabled={isPrefilled}   // <-- ADD THIS
                  onPress={() => {
                    if (!isPrefilled) {
                      setShowMandateModal(true);
                    }
                  }}
                  title="Folio Number"
                />
                {errors.selectedMandate && (
                  <Text allowFontScaling={false} style={styles.errorText}>{errors.selectedMandate}</Text>
                )}

                <ModalDropdown
                  visible={showMandateModal}
                  data={mandateList}
                  onSelect={handleSelectMandate}
                  onClose={() => setShowMandateModal(false)}
                  loading={folioLoading}
                />
              </>
            )}

            <Text allowFontScaling={false} style={styles.titleText}>
              Category Name: <Text allowFontScaling={false} style={styles.inputText}>{categoryName}</Text>
            </Text>
            <Text allowFontScaling={false} style={styles.titleText}>
              Scheme Option: <Text allowFontScaling={false} style={styles.inputText}>{investmentOption}</Text>
            </Text>

            <View style={styles.btnRowss}>
              <CustomBackButton
                title={'Cancel'}
                onPress={handleGoBack}
              />
              <CustomButton
                buttonStyle={styles.submitbtn}
                textStyle={styles.submtText}
                title={loading ? <Loader /> : 'Next'}
                loading={loading}
                onPress={handleNext}
                disabled={loading}
              />
            </View>
          </ScrollView>

          {/* Modals */}
          <ModalDropdown
            visible={showAmcModal}
            data={amcList}
            loading={amcLoading}
            onSelect={handleSelectAmc}
            onClose={() => setShowAmcModal(false)}
          />
          <ModalDropdown
            visible={showSchemeModal}
            data={schemeList}
            loading={schemeLoading}
            onSelect={handleSelectScheme}
            onClose={() => setShowSchemeModal(false)}
            onEndReached={() => {
              if (!schemeLastPage && !schemeLoadingMore) {
                fetchFundSchemes(selectedAmc.value, schemePage + 1, false, searchQuery);
              }
            }}
            footerLoading={schemeLoadingMore}
            searchable={true}
            onSearch={handleSchemeSearch}
          />


        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(11) }]}>
      <CustomHeader title="Lumpsum" showBack />
      <Firstprogress style={styles.progressbarStyle} />
      {addReferalDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  cancelbtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue,
    width: '48%',
  },
  submitbtn: {
    width: '48%',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(3),
  },

  errorText: {
    color: Colors.red,
    fontSize: 11,
    marginTop: responsiveHeight(1),
    fontFamily: Fonts.Semibold700
  },
  valuesText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },
  schemeText: {
    color: Colors.grey
  },
  titleText: {
    fontSize: 12,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    fontWeight: 'bold',
    marginTop: responsiveHeight(1)
  },
  inputText: {
    fontSize: 12,
    color: Colors.blue,
    fontFamily: Fonts.Semibold700,
    fontWeight: '400'
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1.5),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsiveWidth(5),
  },
  radioOuter: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.blue,
  },
  radioSelectedOuter: {
    borderColor: Colors.blue,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.Semibold700,
    fontWeight: 'bold',
  },

});

export default OneTimeFirstForm;
