import { View, StyleSheet, Text } from 'react-native';
import Colors from '../../Themes/Colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import SchemeFolioTab from '../SchemeFolioTab';
import SchemeCard from '../SchemeCard';
import { Fonts } from '../../Themes/Fonts';
import RedeemContainer from '../RedeemContainer';
import getEnvVars from '../../utils/config';


const SchemeContainer = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Scheme');
  const [schemeLoading, setSchemeLoading] = useState(true);
  const [folioLoading, setFolioLoading] = useState(true);
  const [schemeData, setSchemeData] = useState([]);
  const [folioData, setFolioData] = useState([]);
  const [schemeHasData, setSchemeHasData] = useState(true);
  const [folioHasData, setFolioHasData] = useState(true);
  const [isSheetVisible, setSheetVisible] = useState(false);
  const { baseURL, endpoints } = getEnvVars();
  const [schemeMessage, setSchemeMessage] = useState("");
  const [folioMessage, setFolioMessage] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [folioSchemes, setFolioSchemes] = useState([]);



  const fetchSchemesData = async () => {
    try {
      setSchemeLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        setSchemeHasData(false);
        setSchemeMessage("Client ID not found");
        return;
      }

      const response = await axios.get(`${baseURL}${endpoints.GET_SCHEME}${ClientId}`);
      const res = response.data?.response;

      if (res?.error === "TOKEN_ERROR") {
        console.warn("Retrying due to token error...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchSchemesData();
      }

      if (res?.status === true && Array.isArray(res?.data) && res.data.length > 0) {
        setSchemeHasData(true);
        setSchemeMessage("");
        const formattedData = res.data.map(item => ({
          ...item,
          name: item?.name ?? "N/A",
          category: item?.type ?? "N/A",
          invested: item?.invested_value?.amount ?? 0,
          currentValue: item?.market_value?.amount ?? 0,
          folioNumber: item?.folio_number ?? "N/A",
        }));
        setSchemeData(formattedData);
      }
      else {
        setSchemeHasData(false);
        setSchemeData([]);
        setSchemeMessage(res?.message || "No schemes found");
      }
    } catch (error) {
      console.error("Scheme API error:", error.message);
      setSchemeHasData(false);
      setSchemeMessage("Something went wrong while fetching schemes");
    } finally {
      setSchemeLoading(false);
    }
  };


  const fetchFoliosData = async (retry = true) => {
    try {
      setFolioLoading(true);
      const ClientId = await AsyncStorage.getItem('clientID');
      if (!ClientId) {
        setFolioHasData(false);
        setFolioData([]);
        setFolioMessage("Client ID not found");
        return;
      }

      const response = await axios.get(`${baseURL}${endpoints.GET_FOLIO}${ClientId}`);
      const res = response.data?.response;
      if (res?.error === "TOKEN_ERROR" && retry) {
        console.warn("Folio API: Token error, retrying once...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchFoliosData(false);
      }

      if (res?.status === true && Array.isArray(res?.data?.folios) && res.data.folios.length > 0) {
        setFolioHasData(true);
        setFolioMessage("");
        const folios = res.data.folios.map(folio => ({
          folioNumber: folio?.folio_number ?? "N/A",
          schemes: (folio?.schemes ?? []).map(scheme => ({
            name: scheme?.name ?? "N/A",
            isin: scheme?.isin ?? "N/A",
            category: scheme?.type ?? "N/A",
            invested: scheme?.invested_value?.amount ?? 0,
            currentValue: scheme?.market_value?.amount ?? 0,
          })),
        }));
        setFolioData(folios);
      } else {
        setFolioHasData(false);
        setFolioData([]);
        setFolioMessage(res?.message || "No folios found");
      }
    } catch (error) {
      console.error("Folio API error:", error.message);
      setFolioHasData(false);
      setFolioData([]);
      setFolioMessage("Something went wrong while fetching folios");
    } finally {
      setFolioLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        await fetchSchemesData();
        await fetchFoliosData();
      };
      fetchAll();
    }, [])
  );

  const RenderSchemeFolio = () => (
    <View>
      {(schemeHasData || folioHasData) ? (
        <View style={{ paddingBottom: responsiveHeight(2) }}>
          {schemeLoading || folioLoading ? (
            <View style={styles.centerLogo}>
              <Loader />
            </View>
          ) : (
            <>
              <SchemeFolioTab activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === 'Scheme' && (
                schemeHasData ? (
                  schemeData.map((scheme, index) => (
                    <SchemeCard
                      key={index}
                      name={scheme.name}
                      category={scheme.category}
                      ISISN={scheme.isin}
                      folioNumber={scheme.folioNumber}
                      invested={scheme.invested}
                      currentValue={scheme.currentValue}
                      onBuyMorePress={() => {
                        setSelectedScheme(scheme);
                        setSheetVisible(true);
                      }}
                    />
                  ))
                ) : (
                  <Text allowFontScaling={false} style={styles.noDataText}>
                    {schemeMessage}
                  </Text>
                )
              )}
              {activeTab === 'Folio' && (
                folioHasData ? (
                  folioData.map((folio, fIndex) => (
                    <View key={fIndex}>
                      {folio.schemes.map((scheme, sIndex) => (
                        <SchemeCard
                          key={`${fIndex}-${sIndex}`}
                          folioNumber={folio.folioNumber}
                          name={scheme.name}
                          ISISN={scheme.isin}
                          category={scheme.category}
                          invested={scheme.invested}
                          currentValue={scheme.currentValue}
                          onBuyMorePress={() => setSheetVisible(true)}
                        />
                      ))}
                    </View>
                  ))
                ) : (
                  <Text allowFontScaling={false} style={styles.noDataText}>
                    {folioMessage}
                  </Text>
                )
              )}
            </>
          )}
        </View>
      ) : null}
    </View>
  );
  return (
    <View>
      <RenderSchemeFolio onClose={() => setSheetVisible(false)}
        schemeData={selectedScheme} />
      <RedeemContainer
        isVisible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        schemeData={selectedScheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    backgroundColor: 'red'
  },
  centerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(2)
  },
  noDataText: {
    textAlign: 'center',
    fontFamily: Fonts.Semibold700,
    fontSize: 16,
    color: Colors.blue,
    marginTop: responsiveHeight(3),
  },

});

export default SchemeContainer;
