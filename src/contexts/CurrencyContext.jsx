import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SUPPORTED_CURRENCIES, fetchExchangeRates, formatCurrency, convertFromINR } from "../services/currency";

const CurrencyContext = createContext(null);
const STORAGE_KEY = "trip_drip_user_currency";

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "INR";
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRates().then((fxRates) => {
      setRates(fxRates || {});
      setLoading(false);
    });
  }, []);

  const setCurrency = useCallback((code) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem(STORAGE_KEY, code);
    }
  }, []);

  const format = useCallback((amountINR) => {
    return formatCurrency(amountINR, currency, rates);
  }, [currency, rates]);

  const convert = useCallback((amountINR) => {
    return convertFromINR(amountINR, currency, rates);
  }, [currency, rates]);

  const currentCurrency = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR;

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      rates,
      format,
      convert,
      currentCurrency,
      currencies: SUPPORTED_CURRENCIES,
      loading,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
