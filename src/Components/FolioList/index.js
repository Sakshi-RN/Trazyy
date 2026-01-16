import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Colors from '../../Themes/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import SchemeCard from '../../Components/SchemeCard';
import RedeemContainer from '../../Components/RedeemContainer';
import getEnvVars from '../../utils/config';
import { Fonts } from '../../Themes/Fonts';

const FolioList = () => {
  const { baseURL, endpoints } = getEnvVars();
  const [folioLoading, setFolioLoading] = useState(true);
  const [folioData, setFolioData] = useState([]);
  const [folioHasData, setFolioHasData] = useState(true);
  const [folioMessage, setFolioMessage] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isSheetVisible, setSheetVisible] = useState(false);

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
            ...scheme,
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
      fetchFoliosData();
    }, [])
  );

  return (
    <ScrollView style={{ paddingBottom: responsiveHeight(2),marginHorizontal:responsiveWidth(5) }}>
      {folioLoading ? (
        <View style={styles.centerLogo}>
          <Loader />
        </View>
      ) : !folioHasData ? (
        <Text allowFontScaling={false} style={styles.noDataText}>
          {folioMessage}
        </Text>
      ) : (
        folioData.map((folio, fIndex) => (
          <View key={fIndex}>
            {folio.schemes.map((scheme, sIndex) => (
              <SchemeCard
                key={`${fIndex}-${sIndex}`}
                folioNumber={folio.folioNumber}
                name={scheme.name}
                category={scheme.type}
                invested={scheme.invested_value?.amount ?? 0}
                currentValue={scheme.market_value?.amount ?? 0}
                onBuyMorePress={() => {
                  setSelectedScheme({
                    ...scheme,
                    folioNumber: folio.folioNumber
                  });
                  setSheetVisible(true);
                }}
              />
            ))}
          </View>
        ))
      )}

      <RedeemContainer
        isVisible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        schemeData={selectedScheme}
      />
    </ScrollView>
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

export default FolioList;
