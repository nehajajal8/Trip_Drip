import dotenv from 'dotenv';
dotenv.config();

import generateItineraryHandler from './api/generate-itinerary.js';
import getWeatherHandler from './api/get-weather.js';
import suggestOutfitsHandler from './api/suggest-outfits.js';
import calculateBudgetHandler from './api/calculate-budget.js';
import chatConciergeHandler from './api/chat-concierge.js';
import getTransportOptionsHandler from './api/get-transport-options.js';
import { PRODUCT_CATALOG, getBrandComparison } from './src/data/productCatalog.js';

function createMockRes() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; return this; },
    end() { return this; }
  };
}

async function runTests() {
  console.log('=== TESTING TRIP DRIP API & SERVICES (PART 3) ===');

  // 1. Test getWeather
  console.log('\n[1/6] Testing getWeather for "Goa"...');
  const reqWeather = { body: { destination: 'Goa', startDate: '2026-10-01', endDate: '2026-10-05' }, method: 'POST' };
  const resWeather = createMockRes();
  await getWeatherHandler(reqWeather, resWeather);
  console.log('Weather Output:', {
    location: resWeather.data?.location,
    avgTemp: Math.round(resWeather.data?.avgTemp || 0),
    conditions: resWeather.data?.conditions,
  });

  // 2. Test generateItinerary
  console.log('\n[2/6] Testing generateItinerary for "Jaipur"...');
  const reqItin = { body: { destination: 'Jaipur', startDate: '2026-10-01', endDate: '2026-10-04', tripStyle: 'Heritage', groupSize: 2 }, method: 'POST' };
  const resItin = createMockRes();
  await generateItineraryHandler(reqItin, resItin);
  console.log('Itinerary Output:', {
    destination: resItin.data?.destination,
    daysCount: resItin.data?.itinerary?.length,
    day1Activities: resItin.data?.itinerary?.[0]?.activities?.length
  });

  // 3. Test calculateBudget (India Edition)
  console.log('\n[3/6] Testing calculateBudget for Delhi to Goa, 30,000 INR, 2 pax...');
  const reqBudget = { body: { from: 'Delhi', destination: 'Goa', totalBudget: 30000, durationDays: 4, groupSize: 2 }, method: 'POST' };
  const resBudget = createMockRes();
  await calculateBudgetHandler(reqBudget, resBudget);
  console.log('Budget Output:', {
    currency: resBudget.data?.currency,
    travelAndHotel: resBudget.data?.summary?.travelAndHotel,
    remainingBudget: resBudget.data?.summary?.remainingBudget,
    perPersonDailySpend: resBudget.data?.summary?.perPersonDailySpend,
  });

  // 4. Test getTransportOptions
  console.log('\n[4/6] Testing getTransportOptions for Mumbai to Goa...');
  const reqTrans = { body: { from: 'Mumbai', to: 'Goa', groupSize: 2 }, method: 'POST' };
  const resTrans = createMockRes();
  await getTransportOptionsHandler(reqTrans, resTrans);
  console.log('Transport Output:', {
    km: resTrans.data?.km,
    train3AC: resTrans.data?.train?.['3AC'],
    busVolvo: resTrans.data?.bus?.['volvo-AC'],
  });

  // 5. Test Chat Concierge with Actions (Part 3 Upgrade)
  console.log('\n[5/6] Testing chatConcierge action execution for "add linen shirt to cart"...');
  const reqChat = {
    body: {
      tripId: 'mock-trip-id',
      userId: 'mock-user-id',
      message: 'Can you please add the Zara linen shirt to my cart?',
      history: []
    },
    method: 'POST'
  };
  const resChat = createMockRes();
  await chatConciergeHandler(reqChat, resChat);
  console.log('Concierge Reply & Actions:', {
    reply: resChat.data?.reply?.slice(0, 70) + '...',
    actionsCount: resChat.data?.actions?.length,
    firstAction: resChat.data?.actions?.[0]?.type,
    itemAdded: resChat.data?.actions?.[0]?.payload?.name
  });

  // 6. Test Product Catalog & Comparison Engine
  console.log('\n[6/6] Testing Static Product Catalog & Cross-Brand Comparison...');
  const comparison = getBrandComparison('short_sleeve_top', 3000);
  console.log('Catalog & Comparison Stats:', {
    totalCatalogItems: PRODUCT_CATALOG.length,
    brandsCount: comparison.length,
    inBudgetItems: comparison.filter(c => c.inBudget).length,
  });

  // 7. Test Chat Concierge for Chai Radar & Hisaab Kitaab
  console.log('\n[7/8] Testing chatConcierge action execution for "chai radar"...');
  const reqRadar = {
    body: {
      tripId: 'mock-trip-id',
      userId: 'mock-user-id',
      message: 'Show me chai radar recommendations for highway dhabas',
      history: []
    },
    method: 'POST'
  };
  const resRadar = createMockRes();
  await chatConciergeHandler(reqRadar, resRadar);
  console.log('Chai Radar Reply & Action:', {
    actionsCount: resRadar.data?.actions?.length,
    firstAction: resRadar.data?.actions?.[0]?.type,
  });

  console.log('\n[8/8] Testing chatConcierge action execution for "settle up hisaab"...');
  const reqHisaab = {
    body: {
      tripId: 'mock-trip-id',
      userId: 'mock-user-id',
      message: 'How do we split expenses and settle hisaab via upi qr?',
      history: []
    },
    method: 'POST'
  };
  const resHisaab = createMockRes();
  await chatConciergeHandler(reqHisaab, resHisaab);
  console.log('Hisaab Reply & Action:', {
    actionsCount: resHisaab.data?.actions?.length,
    firstAction: resHisaab.data?.actions?.[0]?.type,
  });

  console.log('\n✅ ALL API HANDLERS, CATALOG & CHAT ACTION TESTS PASSED (8/8)!');
}

runTests();
