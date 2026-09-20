/**
 * test_itinerary_tester.js
 * Automated test suite acting as QA tester for Trip Drip Itinerary generation and deduplication.
 */
import {
  INDIA_ITINERARY_TEMPLATES,
  buildTemplateItinerary,
  isDuplicateOrInvalidItinerary,
  findItineraryTemplate,
} from "./src/data/indiaItineraries.js";

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

console.log("=================================================");
console.log("🧪 TRIP DRIP QA AUTOMATED ITINERARY TEST SUITE");
console.log("=================================================");

// TEST 1: Check all template destinations have at least 5 distinct days
console.log("\n[TEST 1] Verifying all template destinations have at least 5 distinct days...");
const destinations = ["Mumbai", "Lonavala", "Delhi", "Goa", "Jaipur", "Rann of Kutch"];

for (const dest of destinations) {
  const templ = INDIA_ITINERARY_TEMPLATES[dest];
  assert(templ !== undefined, `Template exists for ${dest}`);
  assert(Array.isArray(templ.days), `Days is an array for ${dest}`);
  assert(templ.days.length >= 5, `${dest} has at least 5 days (has ${templ.days.length})`);

  // Verify no two days inside the template share the same route or theme
  const routes = new Set();
  const themes = new Set();
  templ.days.forEach((d, idx) => {
    assert(!routes.has(d.route), `${dest} Day ${idx + 1} route is unique ("${d.route}")`);
    assert(!themes.has(d.theme), `${dest} Day ${idx + 1} theme is unique ("${d.theme}")`);
    assert(d.wardrobeAdvice && d.wardrobeAdvice.outfit, `${dest} Day ${idx + 1} has wardrobe outfit advice`);
    assert(d.wardrobeAdvice.footwear, `${dest} Day ${idx + 1} has wardrobe footwear advice`);
    routes.add(d.route);
    themes.add(d.theme);
  });
}

// TEST 2: Test 5-day and 7-day generation for all destinations
console.log("\n[TEST 2] Verifying generated 5-day itineraries have unique days (no Day 1,2,3 duplicates)...");
const testCases = [
  { dest: "Mumbai", days: 5 },
  { dest: "Lonavala", days: 5 },
  { dest: "Goa", days: 5 },
  { dest: "Jaipur", days: 5 },
  { dest: "Delhi", days: 5 },
  { dest: "Rann of Kutch", days: 5 },
  { dest: "Kolkata (fallback)", days: 5 },
  { dest: "Kerala (fallback)", days: 5 },
  { dest: "Jaipur (7-day extended)", days: 7 },
  { dest: "Lonavala (7-day extended)", days: 7 },
];

for (const tc of testCases) {
  const startDate = "2026-10-01";
  const endDate = new Date(new Date(startDate).getTime() + (tc.days - 1) * 86400000).toISOString().split("T")[0];
  const itin = buildTemplateItinerary(tc.dest, startDate, endDate, 12000, 5, "Mixed");

  assert(itin.length === tc.days, `${tc.dest} generated exactly ${tc.days} days`);
  assert(!isDuplicateOrInvalidItinerary(itin), `${tc.dest} isDuplicateOrInvalidItinerary returned FALSE`);

  // Assert Day 1, Day 2, Day 3 are strictly distinct
  assert(itin[0].route !== itin[1].route, `${tc.dest}: Day 1 route !== Day 2 route`);
  assert(itin[1].route !== itin[2].route, `${tc.dest}: Day 2 route !== Day 3 route`);
  assert(itin[0].route !== itin[2].route, `${tc.dest}: Day 1 route !== Day 3 route`);

  assert(itin[0].theme !== itin[1].theme, `${tc.dest}: Day 1 theme !== Day 2 theme`);
  assert(itin[1].theme !== itin[2].theme, `${tc.dest}: Day 2 theme !== Day 3 theme`);
  assert(itin[0].theme !== itin[2].theme, `${tc.dest}: Day 1 theme !== Day 3 theme`);

  // Check sequential labels
  itin.forEach((d, idx) => {
    assert(d.day === idx + 1, `${tc.dest}: Day property is ${idx + 1}`);
    assert(d.dayLabel.includes(`Day ${idx + 1}`), `${tc.dest}: Day label contains "Day ${idx + 1}"`);
  });
}

// TEST 3: Test isDuplicateOrInvalidItinerary detecting buggy/broken itineraries
console.log("\n[TEST 3] Verifying auto-detection catches identical Day 1, 2, 3 itineraries...");
const mockDuplicateItin = [
  {
    day: 1,
    dayLabel: "Day 1 🏛️",
    route: "CSMT → Fort → Gateway of India → Colaba Causeway → Marine Drive",
    theme: "Heritage South Bombay",
    wardrobeAdvice: { outfit: "Cotton tee" },
    activities: ["Walk"]
  },
  {
    day: 2,
    dayLabel: "Day 2 🏛️",
    route: "CSMT → Fort → Gateway of India → Colaba Causeway → Marine Drive", // DUPLICATE ROUTE
    theme: "Heritage South Bombay", // DUPLICATE THEME
    wardrobeAdvice: { outfit: "Cotton tee" },
    activities: ["Walk"]
  },
  {
    day: 3,
    dayLabel: "Day 3 🏛️",
    route: "CSMT → Fort → Gateway of India → Colaba Causeway → Marine Drive", // DUPLICATE ROUTE
    theme: "Heritage South Bombay", // DUPLICATE THEME
    wardrobeAdvice: { outfit: "Cotton tee" },
    activities: ["Walk"]
  }
];

assert(isDuplicateOrInvalidItinerary(mockDuplicateItin) === true, "Correctly flagged identical Day 1, 2, 3 as duplicate!");

// TEST 4: Test Auto-Repair logic simulation
console.log("\n[TEST 4] Verifying auto-repair fixes duplicate itineraries cleanly...");
let repairedItin = mockDuplicateItin;
if (isDuplicateOrInvalidItinerary(repairedItin)) {
  repairedItin = buildTemplateItinerary("Mumbai", "2026-10-01", "2026-10-03", 6000, 3, "Heritage");
}

assert(isDuplicateOrInvalidItinerary(repairedItin) === false, "Repaired itinerary is no longer duplicate!");
assert(repairedItin.length === 3, "Repaired itinerary has 3 days");
assert(repairedItin[0].route !== repairedItin[1].route, "Repaired Day 1 !== Day 2");
assert(repairedItin[1].route !== repairedItin[2].route, "Repaired Day 2 !== Day 3");

console.log(`\n🎉 ALL ${passedTests}/${totalTests} ITINERARY QA TESTS PASSED SUCCESSFULLY!`);
