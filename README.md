# 🧳 Trip Drip (India Edition) — AI Travel Operating System & Smart Wardrobe Companion by Neha Jajal & Ujjwal Savla

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4_Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Test Suite](https://img.shields.io/badge/Automated_Tests-81%2F81_Passed_(100%25)-brightgreen?style=for-the-badge)](https://github.com/nehajajal8/Trip_Drip)

> **Trip Drip** is a modern, full-stack travel operating system and intelligent wardrobe styling companion tailored for Indian transit corridors and global expeditions. It eliminates travel friction by integrating itinerary scheduling, luggage climate optimization, group debt simplification, railway gastronomy discovery, and offline-first maps into a unified, responsive interface.

---

## 🌟 Key Features & Innovations

### 1. 🗺️ Predictive Multi-City Itinerary Generator
* **Deduplication Invariant**: Generates 3 to 7-day customized itineraries across key corridors (**Mumbai, Lonavala, Goa, Jaipur, Delhi, Rann of Kutch, Kolkata, Kerala**) where **Day 1 ≠ Day 2 ≠ Day 3** in route, theme, and activities.
* **Auto-Repair Self-Healing**: Automatically scans and repairs corrupted or legacy itineraries in-flight without losing traveler dates or budget metadata.
* **Style Customization**: Tailored preferences for Heritage & Culture, Beach, Mountain, Offbeat vs Popular, and City exploration.

### 2. 💸 Hisaab-Kitaab (Group Expense Splitter & UPI QR)
* **Minimal Cashflow Algorithm**: Employs a Greedy Bipartite Debt Simplification engine that collapses complex mutual debts among $N$ travelers into at most $N - 1$ direct settlement transactions.
* **Instant Scan-to-Pay UPI QR**: Automatically builds NPCI-compliant deep links (`upi://pay?pa=...&cu=INR`) and renders interactive QR codes readable by **Google Pay, PhonePe, Paytm, and BHIM**.

### 3. ☕ Chai & Station Radar (Transit Gastronomy)
* **Transit Corridor Intelligence**: Curated gastronomy intelligence for major railway hubs and highway routes (CSMT Mumbai, Lonavala Western Ghats, Old Delhi Junction, Jaipur Junction, Madgaon Goa, Bhuj).
* **Verified Platform Tapris**: Spotlights iconic local specialties (Cutting Masala Chai, Aram Vada Pav, Lonavala Chikki) with pricing and operating hours.
* **Clean Hydration Checkpoints**: Real-time alerts for verified **IRCTC Rail Neer** and purified drinking water booths.

### 4. 👗 Smart AI Wardrobe & Weather Suitability Scoring
* **Client-Side Image Optimization**: Compresses raw photos using HTML5 Canvas before network egress, reducing upload size by up to 85% (< 300KB).
* **Computer Vision Tagging**: Automatically detects garment categories, dominant color palettes, and fabric breathability.
* **Suitability Index (0–10)**: Evaluates clothes against destination weather forecasts (e.g., breathable linen for humid Goa vs fleece for windy Lonavala ghats).
* **pgvector Visual Embeddings**: Generates 1536-dimensional dense vector embeddings stored in Supabase PostgreSQL for similarity search.

### 5. 🛍️ Cross-Brand Fashion Comparison & Cart
* **4-Brand Benchmark**: Compares equivalent apparel side-by-side across **Zara, H&M, Uniqlo, and Westside**.
* **Dynamic Budget Deduction**: Items added to the cart dynamically deduct from the trip's remaining budget.
* **Decoupled DOM Event Bus**: Emits custom `trip_cart_updated` events to sync the AI Butler, Dashboard, and Cart in real-time.

### 6. 🤖 AI Travel Butler (`TripConcierge`)
* **Action-Taking Conversational Chain**: Built on LangChain with real client-side action execution (`ADD_TO_CART`, `MARK_PACKED`, `ADD_EXPENSE`, `OPEN_CHAI_RADAR`, `OPEN_HISAAB_KITAAB`).
* **Resilient Fallback Parser**: Features a deterministic local NLP keyword engine, ensuring 100% action availability even without an active OpenAI API key or during network drops.

### 7. 📡 Offline-First PWA & Vector Maps
* **Dual-Tier Cache**: Service Worker (`public/sw.js`) caches Leaflet libraries and OpenStreetMap vector tiles for disconnected viewing.
* **IndexedDB Architecture (`trip_drip_offline_db` v2)**: Maintains 7 dedicated object stores (`trips`, `wardrobe`, `checklist`, `cart`, `journal`, `expenses`, `squad`) with LocalStorage fallback.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER / PROGRESSIVE WEB APP                 │
│                                                                         │
│  React 18 SPA (Vite)  ◄───►  AuthContext & CurrencyContext (INR/USD)   │
│           │                                      │                      │
│           ▼                                      ▼                      │
│  Service Worker (sw.js)                  IndexedDB (v2 Stores)          │
│  - OpenStreetMap Tiles Cache             - trips, cart, expenses        │
│  - Leaflet Assets Cache                  - wardrobe, journal, squad     │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTP / REST & WebSockets
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    EDGE SERVERLESS MICROSERVICES (/api/*)                │
│                                                                         │
│  • /api/calculate-budget         • /api/chat-concierge (LangChain)     │
│  • /api/get-weather              • /api/upload-garment (Vision ML)      │
│  • /api/get-transport-options    • /api/suitability-score               │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│     SUPABASE POSTGRESQL      │          │     EXTERNAL AI & APIS       │
│  - users, trips, expenses    │          │  - OpenAI GPT-4o-mini        │
│  - wardrobe_items (pgvector) │          │  - Hugging Face Inference    │
│  - Row-Level Security (RLS)  │          │  - OpenStreetMap Vector CDN  │
│  - 'wardrobe' Storage Bucket │          │  - NPCI UPI Protocol Scheme  │
└──────────────────────────────┘          └──────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | [React](https://react.dev/) | `^18.3.1` | Single-Page Application (SPA) component architecture |
| **Build & Dev Tooling**| [Vite](https://vitejs.dev/) | `^5.4.2` | Lightning-fast HMR and optimized Rollup bundling |
| **Styling & Design**   | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.10` | Responsive layout tokens and glassmorphism styling |
| **Client Routing**     | [React Router DOM](https://reactrouter.com/) | `^6.26.1` | Nested sub-routes, route guards, persistent layouts |
| **Icons**              | [Lucide React](https://lucide.dev/) | `^0.436.0` | Clean, lightweight SVG icon system |
| **Interactive Maps**   | [Leaflet](https://leafletjs.com/) & React-Leaflet | `^1.9.4` / `^4.2.1` | OpenStreetMap tiles, transit route markers |
| **Backend Runtime**    | [Node.js](https://nodejs.org/) & Express | `v24+` / `^4.19.2` | Microservice endpoints and Vercel serverless functions |
| **Database & Auth**    | [Supabase](https://supabase.com/) | `^2.44.4` | PostgreSQL relational database, Auth, Storage, RLS |
| **Vector Search**      | `pgvector` | `0.5.0+` | 1536-dimensional cosine distance similarity for wardrobe |
| **AI Orchestration**  | [LangChain Core](https://js.langchain.com/) | `^0.2.27` | Conversational prompt templates & action dispatch |
| **Offline Engine**     | Service Worker + IndexedDB | `DB v2` | Complete zero-connectivity PWA resilience |

---

## 📁 Project Directory Structure

```text
trip-drip/
├── api/                             # Serverless edge microservice endpoints
│   ├── calculate-budget.js          # INR categorical budget allocator
│   ├── chat-concierge.js            # LangChain conversational AI & action dispatcher
│   ├── color-match.js               # Complementary wardrobe color harmony engine
│   ├── find-similar-items.js        # pgvector similarity search
│   ├── generate-itinerary.js        # Dynamic itinerary generation
│   ├── get-transport-options.js     # Train and bus transit pricing matrix
│   ├── get-weather.js               # 5-day destination weather forecasts
│   ├── suggest-outfits.js           # Multi-piece outfit recommendations
│   ├── suitability-score.js         # Climate suitability calculator (0–10)
│   └── upload-garment.js            # Garment ingestion and vision classification
├── docs/                            # Formal system documentation
│   ├── Trip_Drip_Design_Document.docx
│   └── Trip_Drip_Testing_Document.docx
├── public/                          # Static assets and PWA service worker
│   ├── sw.js                        # CacheStorage handler for OSM tiles & Leaflet
│   └── favicon.ico
├── src/
│   ├── components/                  # Reusable UI component modules
│   │   ├── auth/                    # ProtectedRoute and authentication guards
│   │   ├── chat/                    # TripConcierge.jsx persistent floating AI butler
│   │   ├── checklist/               # Packing checklist components
│   │   ├── expenses/                # Hisaab-Kitaab settlement & UPI QR components
│   │   ├── food/                    # ChaiStationRadarModal.jsx corridor gastronomy
│   │   ├── itinerary/               # Itinerary day cards and route timelines
│   │   ├── layout/                  # Navbar, footer, and navigation wrappers
│   │   ├── maps/                    # Leaflet interactive map containers
│   │   └── ui/                      # OfflineBanner, modals, loaders, badges
│   ├── contexts/                    # Global state providers
│   │   ├── AuthContext.jsx          # Supabase authentication session manager
│   │   └── CurrencyContext.jsx      # Multi-currency exchange rate manager
│   ├── data/                        # Verified regional datasets
│   │   ├── chaiStationRadarData.js  # Railway station corridors, tapris & water points
│   │   ├── indiaItineraries.js      # Deduplicated multi-day destination templates
│   │   ├── indiaTransport.js        # Inter-city railway & highway distances
│   │   └── productCatalog.js        # 29-item Zara/H&M/Uniqlo/Westside apparel catalog
│   ├── pages/                       # Application route views
│   │   ├── Landing.jsx              # Hero presentation & value proposition
│   │   ├── AuthPages.jsx            # Login & Signup tabbed views
│   │   ├── Trips.jsx                # Saved trips dashboard & deletion modal
│   │   ├── NewTrip.jsx              # 5-step trip planning wizard
│   │   ├── TripDashboard.jsx        # Day schedule, weather card & transit map
│   │   ├── Expenses.jsx             # Hisaab-Kitaab group expense settlement
│   │   ├── Wardrobe.jsx             # Smart wardrobe & climate suitability score
│   │   ├── Shop.jsx                 # 4-way cross-brand fashion comparison & cart
│   │   ├── Journal.jsx              # Travel diary & photo memories
│   │   └── Settings.jsx             # Profile, currency & token preferences
│   ├── services/                    # Local storage & currency services
│   │   ├── offlineStorage.js        # IndexedDB (v2) persistence & LocalStorage fallback
│   │   └── currency.js              # Currency conversion math
│   ├── utils/
│   │   └── imageOptimizer.js        # Client-side HTML5 canvas compression (< 300KB)
│   ├── App.jsx                      # Route definitions & TripLayout composition
│   ├── main.jsx                     # DOM mount point
│   └── index.css                    # Tailwind CSS directives & global styling
├── supabase/
│   └── migrations/                  # PostgreSQL schema, RLS policies & vector migrations
├── test_all_features.js             # Comprehensive automated test suite (81 assertions)
├── package.json                     # Project manifest & script definitions
└── vite.config.js                   # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher (Tested on Node `v24.18.0`)
* **npm**: v9.0.0 or higher
* **Git**

### 2. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/nehajajal8/Trip_Drip.git

# Navigate to project directory
cd Trip_Drip

# Install dependencies
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your credentials inside `.env`:

```ini
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# AI Orchestration (Optional for local fallback)
OPENAI_API_KEY=sk-your-openai-api-key

# Local API Server Port
PORT=3001
```

> **Note**: The application features built-in deterministic offline fallbacks. Even without an `OPENAI_API_KEY`, the itinerary generator, Hisaab-Kitaab engine, Chai Radar, and AI Butler action triggers function seamlessly!

### 4. Running the Application Locally

```bash
# Terminal 1: Start Vite Frontend Dev Server
npm run dev

# Terminal 2: Start Edge Microservices API (Optional)
npm run dev:api
```

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Quality Assurance

Trip Drip includes an automated end-to-end regression test suite verifying **81 formal assertions** across all functional modules with a **100% pass rate**:

```bash
# Run comprehensive automated test suite
node test_all_features.js
```

### Automated QA Verification Results

```text
=====================================================================
🚀 TRIP DRIP — COMPREHENSIVE AUTOMATED SYSTEM & QA TEST SUITE
=====================================================================
• Trip Management & Deletion Engine     : 7/7 tests passed (100%)
• Itinerary Generation & Deduplication  : 45/45 tests passed (100%)
• Auto-Repair of Corrupted Trips        : 4/4 tests passed (100%)
• Hisaab-Kitaab Settlement & UPI QR     : 5/5 tests passed (100%)
• Chai & Station Radar Transit Data     : 7/7 tests passed (100%)
• Free Offline Map & Proximity Math     : 3/3 tests passed (100%)
• Product Catalog & Brand Benchmark     : 3/3 tests passed (100%)
• Edge API Microservice Handlers        : 3/3 tests passed (100%)
• AI Travel Butler Real Actions         : 4/4 tests passed (100%)
=====================================================================
🏁 TOTAL VERIFIED ASSERTIONS : 81 / 81 PASSED (100.0%)
=====================================================================
```

---

## 📱 Offline-First PWA Support

Trip Drip is engineered to survive zero-connectivity transit conditions (e.g., train journeys through tunnels and remote ghats):
1. **Service Worker (`sw.js`)**: Automatically intercepts and caches Leaflet CSS/JS and OpenStreetMap tile assets.
2. **IndexedDB Fallback**: All trips, expenses, checklist changes, and journal logs persist locally and sync automatically when internet connectivity resumes.
3. **Offline Banner**: An alert banner notifies users when operating in offline cache mode.

---

## 🔒 Security & Privacy Architecture
* **Row-Level Security (RLS)**: Enforced across all Supabase PostgreSQL tables; users can only read and mutate their own trips and data.
* **Client Canvas Sanitization**: Images are downsampled and converted to clean JPEG buffers prior to transmission.
* **Direct UPI Protocol**: UPI payment URIs are generated on-device with zero intermediary transaction storage, protecting user banking privacy.

---

## 📄 Documentation Assets
* **System Design & UI/UX Specification**: [Trip_Drip_Design_Document.docx](docs/Trip_Drip_Design_Document.docx)
* **Manual QA Testing & Execution Workbook**: [Trip_Drip_Testing_Document.docx](docs/Trip_Drip_Testing_Document.docx)

---

## 👥 Contributors & Acknowledgements
* **Lead Architecture & Development**: Neha Jajal & Engineering Team
* **Mapping Data**: OpenStreetMap contributors
* **Iconography**: Lucide React community

---

## 📝 License
This project is licensed under the [MIT License](LICENSE).
