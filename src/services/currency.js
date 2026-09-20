/**
 * src/services/currency.js
 * Currency conversion utility with live exchange rates from open API + offline fallback.
 * Base currency in database is INR (Trip Drip India Edition).
 */

export const SUPPORTED_CURRENCIES = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rateFromINR: 1, locale: "en-IN" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateFromINR: 0.012, locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateFromINR: 0.011, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateFromINR: 0.0095, locale: "en-GB" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", rateFromINR: 0.044, locale: "ar-AE" },
  THB: { code: "THB", symbol: "฿", name: "Thai Baht", rateFromINR: 0.43, locale: "th-TH" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rateFromINR: 1.82, locale: "ja-JP" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", rateFromINR: 0.016, locale: "en-SG" },
};

const CACHE_KEY = "trip_drip_fx_rates_v1";
const CACHE_TIME_KEY = "trip_drip_fx_rates_time";
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

export async function fetchExchangeRates() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION)) {
      return JSON.parse(cached);
    }

    const res = await fetch("https://open.er-api.com/v6/latest/INR");
    if (!res.ok) throw new Error("FX rate fetch failed");
    const data = await res.json();

    if (data && data.rates) {
      const rates = {};
      Object.keys(SUPPORTED_CURRENCIES).forEach((code) => {
        rates[code] = data.rates[code] || SUPPORTED_CURRENCIES[code].rateFromINR;
      });
      localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      return rates;
    }
  } catch (e) {
    console.warn("Using fallback FX rates:", e.message);
  }

  // Fallback rates
  const fallback = {};
  Object.keys(SUPPORTED_CURRENCIES).forEach((code) => {
    fallback[code] = SUPPORTED_CURRENCIES[code].rateFromINR;
  });
  return fallback;
}

export function convertFromINR(amountINR, targetCurrencyCode = "INR", rates = {}) {
  const num = parseFloat(amountINR) || 0;
  if (targetCurrencyCode === "INR") return num;
  const rate = rates[targetCurrencyCode] || SUPPORTED_CURRENCIES[targetCurrencyCode]?.rateFromINR || 1;
  return num * rate;
}

export function formatCurrency(amountINR, targetCurrencyCode = "INR", rates = {}) {
  const currencyInfo = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES.INR;
  const converted = convertFromINR(amountINR, targetCurrencyCode, rates);

  if (targetCurrencyCode === "INR") {
    return `₹${Math.round(converted).toLocaleString("en-IN")}`;
  }

  // JPY has no decimals
  if (targetCurrencyCode === "JPY") {
    return `${currencyInfo.symbol}${Math.round(converted).toLocaleString(currencyInfo.locale)}`;
  }

  // 2 decimal places for other currencies if < 100, else integer rounded
  const formatted = converted < 100
    ? converted.toLocaleString(currencyInfo.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(converted).toLocaleString(currencyInfo.locale);

  return `${currencyInfo.symbol}${formatted}`;
}
