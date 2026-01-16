import {
  View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';
import { CommonStyles } from '../../Themes/CommonStyles';
import { SIPFirstprogress } from '../../Assets/svg';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import Colors from '../../Themes/Colors';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import ModalDropdown from '../../Components/ModalDropdown';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBackButton from '../../Components/CustomBackButton';
import { Fonts } from '../../Themes/Fonts';
import getEnvVars from '../../utils/config';

const SIPFirstForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { baseURL, endpoints } = getEnvVars();
  const [folioLoading, setFolioLoading] = useState(false);
  const [showMandateModal, setShowMandateModal] = useState(false);
  const [frequencyList, setFrequencyList] = useState([]);
  const [showAmcModal, setShowAmcModal] = useState(false);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [amcLoading, setAmcLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mandateList, setMandateList] = useState([]);
  const [amcList, setAmcList] = useState([]);
  const [schemeList, setSchemeList] = useState([]);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const { existingFolio } = route.params || {};

  const [folioType, setFolioType] = useState(existingFolio ? 'existing' : 'new');
  const [selectedMandate, setSelectedMandate] = useState(null);
  const [selectedAmc, setSelectedAmc] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [investmentOption, setInvestmentOption] = useState('');
  const [schemePage, setSchemePage] = useState(1);
  const [schemeLastPage, setSchemeLastPage] = useState(false);
  const [schemeLoadingMore, setSchemeLoadingMore] = useState(false);






  const mapFrequencies = (freqArray = []) => {
    if (!Array.isArray(freqArray)) return [];
    return freqArray.map((freq, idx) => {
      const dates = Array.isArray(freq.dates_json)
        ? freq.dates_json
        : Array.isArray(freq.dates)
          ? freq.dates
          : [];

      return {
        label: (freq.frequency_name || freq.frequency_type || '').toString().toUpperCase(),
        value: (freq.frequency_name || freq.frequency_type || `freq_${idx}`).toString().toLowerCase(),
        valueType: freq.frequency_type || freq.frequency_name || null,
        dates: dates.map(d => Number(d)),
        minAmount: Number(freq.min_installment_amount || freq.minAmount || 0),
        maxAmount: Number(freq.max_installment_amount || freq.maxAmount || 0),
        minInstallments: Number(freq.min_installments || freq.minInstallments || 0),
        raw: freq
      };
    });
  };


useEffect(() => {
  if (existingFolio) {
    setIsPrefilled(true);
    setSelectedMandate({
      label: existingFolio.number,
      value: existingFolio.number,
      frequencies: existingFolio.frequencies,
    });
    setSelectedAmc({
      label: existingFolio.amc_name,
      value: existingFolio.amc_id
    });
    setSelectedScheme({
      label: existingFolio.fund_scheme_name,
      value: existingFolio.isin,
      fund_category: existingFolio.fund_category,
      investment_option: existingFolio.investment_option,
      frequencies: existingFolio.frequencies || []
    });
    setCategoryName(existingFolio.fund_category || '');
    setInvestmentOption(existingFolio.investment_option || '');
    setFrequencyList(mapFrequencies(existingFolio.frequencies || []));
  } else {
    setSelectedMandate(null);
    setSelectedAmc(null);
    setSelectedScheme(null);
    setCategoryName('');
    setInvestmentOption('');
    setFrequencyList([]);
    setFolioType('new');
  }

  fetchAmcList();
  fetchFolios();
}, [existingFolio]);

  const fetchAmcList = async () => {
    try {
      setAmcLoading(true);
      const response = await axios.get(`${baseURL}${endpoints.GET_AMCS_LIST}`);
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

      let url = `${baseURL}${endpoints.GET_FUND_SCHEMES_SIP}${amcId}?page=${page}&size=100`;
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
        frequencies: item.frequencies ?? [],
      }));

      setSchemeList(prev =>
        page === 0 ? formatted : [...prev, ...formatted]
      );

      setSchemeLastPage(res.last);
      setSchemePage(page);
    } catch (error) {
      console.error('Fund Scheme SIP Error:', error);
    } finally {
      setSchemeLoading(false);
      setSchemeLoadingMore(false);
    }
  };


  const fetchFolios = async () => {
    try {
      setFolioLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        console.warn('No client ID found in AsyncStorage.');
        setMandateList([]);
        return;
      }
      const res = await axios.get(`${baseURL}${endpoints.GET_MF_FOLIOS}${ClientId}`);
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

  const handleSelectAmc = (item) => {
    setSelectedAmc(item);
    setSelectedScheme(null);
    setCategoryName('');
    setInvestmentOption('');
    setFrequencyList([]);

    setSchemeList([]);
    setSchemePage(0);
    setSchemeLastPage(false);
    setSearchQuery('');

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
    }, 500);

    setSearchTimeout(timeout);
  };


  const handleSelectScheme = (item) => {
    setSelectedScheme(item);
    setCategoryName(item.fund_category || '');
    setInvestmentOption(item.investment_option || '');

    const freqOptions = mapFrequencies(item.frequencies || []);
    setFrequencyList(freqOptions);
    setShowSchemeModal(false);
  };

  const handleNext = () => {
    let newErrors = {};
    if (!selectedAmc) newErrors.selectedAmc = "Please select AMC name.";
    if (!selectedScheme) newErrors.selectedScheme = "Please select a scheme.";
    if (!selectedScheme) newErrors.categoryName = "Category is required.";
    if (!selectedScheme) newErrors.investmentOption = "Investment Option is required.";

    if (folioType === 'existing' && !selectedMandate) {
      newErrors.selectedMandate = "Please select Folio Number.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const finalMandate = folioType === 'new' ? { label: 'New Folio', value: 'new' } : selectedMandate;

    navigation.navigate('SIPNewForm', {
      selectedAmc,
      selectedScheme,
      categoryName,
      investmentOption,
      folio: finalMandate,
      frequencyList
    });
  };

  const handleSelectMandate = (item) => {
    setSelectedMandate(item);
    setShowMandateModal(false);
  };

  return (
    <View style={[CommonStyles.container, { paddingBottom: responsiveHeight(12) }]}>
      <CustomHeader title="SIP Purchase" showBack={true} />
      <SIPFirstprogress style={styles.progressbarStyle} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[CommonStyles.containerBox, styles.scrollContentStyle]}>
            <CustomTextInput
              value={selectedAmc?.label || ''}
              placeholder="Select AMC Name"
              isDropdown={true}
              title={'AMC Name'}
              disabled={isPrefilled}
              onPress={() => !isPrefilled && setShowAmcModal(true)}
            />
            {errors.selectedAmc && <Text allowFontScaling={false} style={styles.errorText}>{errors.selectedAmc}</Text>}

            <CustomTextInput
              value={selectedScheme?.label || ''}
              placeholder="Enter Scheme Name"
              iconColor={selectedAmc ? Colors.grey : Colors.NEWLIGHTGREY}
              isDropdown={true}
              title={'Scheme Name'}
              editable={false}
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
                  isDropdown={true}
                  value={selectedMandate?.label || ''}
                  editable={false}
                  disabled={isPrefilled}
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

            <Text allowFontScaling={false} style={styles.titleText}>Category Name: <Text allowFontScaling={false} style={styles.inputText}>{categoryName}</Text></Text>
            <Text allowFontScaling={false} style={styles.titleText}>Scheme Option: <Text allowFontScaling={false} style={styles.inputText}>{investmentOption}</Text></Text>

            <View style={styles.btnRowss}>
              <CustomBackButton title="Cancel" onPress={() => navigation.goBack()} />
              <CustomButton buttonStyle={styles.submitbtn} textStyle={styles.submtText} title="Next" onPress={handleNext} />
            </View>

            <ModalDropdown visible={showAmcModal} data={amcList} onSelect={handleSelectAmc} onClose={() => setShowAmcModal(false)} loading={amcLoading} />
            <ModalDropdown
              visible={showSchemeModal}
              data={schemeList}
              onSelect={handleSelectScheme}
              onClose={() => setShowSchemeModal(false)}
              loading={schemeLoading}
              onEndReached={() => {
                if (!schemeLastPage && !schemeLoadingMore) {
                  fetchFundSchemes(selectedAmc.value, schemePage + 1, false, searchQuery);
                }
              }}
              footerLoading={schemeLoadingMore}
              searchable={true}
              onSearch={handleSchemeSearch}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};



const styles = StyleSheet.create({

  scrollContentStyle: {
    marginHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(3),
  },
  progressbarStyle: {
    alignSelf: 'center',
    marginTop: responsiveHeight(3)
  },
  inputWidth: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
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

  valuesText: {
    color: Colors.skyblue,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },
  schemeText: {
    color: Colors.grey,
    fontSize: 11,
    fontFamily: Fonts.Semibold700
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnRowss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2)
  },
  inputViewStyle: {
    borderColor: Colors.lightGrey,
    borderWidth: 1.5,
    marginTop: responsiveHeight(1.5),
    width: '47%',

  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: responsiveHeight(0.5),
    fontFamily: Fonts.Semibold700
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  label: {
    marginLeft: responsiveWidth(2),
    fontSize: 12,
    color: Colors.grey,
    fontFamily: Fonts.Semibold700,
  },
  titleText: {
    fontSize: 13,
    color: Colors.blue,
    fontFamily: Fonts.Bold800,
    marginTop: responsiveHeight(1),
    fontWeight: 'bold'
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

export default SIPFirstForm;
