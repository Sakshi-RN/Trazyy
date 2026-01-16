// CartCountContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from './config';

const CartCountContext = createContext({
  sipCount: 0,
  lumpsumCount: 0,
  refreshCartCounts: () => { },
});

export const CartCountProvider = ({ children }) => {
  const [sipCount, setSipCount] = useState(0);
  const [lumpsumCount, setLumpsumCount] = useState(0);

  const fetchCartCounts = async () => {
    try {
      const clientId = await AsyncStorage.getItem('clientID');
      if (!clientId) return;
      const { baseURL, endpoints } = getEnvVars();
      const response = await axios.get(`${baseURL}${endpoints.GET_CART_ORDERS}${clientId}?trx_type=all`);
      const resp = response?.data?.response;
      if (resp?.status) {
        setSipCount(resp.sipCount || 0);
        setLumpsumCount(resp.lumpsumCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch cart counts:', error.message);
    }
  };

  // Fetch counts once on mount
  useEffect(() => {
    fetchCartCounts();
  }, []);

  return (
    <CartCountContext.Provider value={{ sipCount, lumpsumCount, refreshCartCounts: fetchCartCounts }}>
      {children}
    </CartCountContext.Provider>
  );
};

export const useCartCounts = () => useContext(CartCountContext);
