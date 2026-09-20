import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TripConcierge from "./components/chat/TripConcierge";
import OfflineBanner from "./components/ui/OfflineBanner";

import Landing       from "./pages/Landing";
import { Login, Signup } from "./pages/AuthPages";
import Trips         from "./pages/Trips";
import NewTrip       from "./pages/NewTrip";
import TripDashboard from "./pages/TripDashboard";
import Wardrobe      from "./pages/Wardrobe";
import Shop          from "./pages/Shop";
import Journal       from "./pages/Journal";
import Expenses      from "./pages/Expenses";
import Settings      from "./pages/Settings";
import JoinTrip      from "./pages/JoinTrip";
import Outfits       from "./pages/Outfits";

// Wraps all /trips/:id/* routes — renders concierge overlay on every sub-page
function TripLayout() {
  return (
    <>
      <Outlet />
      <TripConcierge />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <OfflineBanner />
          <Routes>
            {/* Public */}
            <Route path="/"       element={<Landing />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/join/:token" element={<JoinTrip />} />
            <Route path="/trips/join/:token" element={<JoinTrip />} />

            {/* Protected top-level */}
            <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
            <Route path="/trips/new" element={<ProtectedRoute><NewTrip /></ProtectedRoute>} />
            <Route path="/outfits"   element={<ProtectedRoute><Outfits /></ProtectedRoute>} />
            <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Trip sub-routes — all share the TripLayout (concierge overlay) */}
            <Route path="/trips/:id" element={<ProtectedRoute><TripLayout /></ProtectedRoute>}>
              <Route index             element={<TripDashboard />} />
              <Route path="wardrobe"   element={<Wardrobe />} />
              <Route path="shop"       element={<Shop />} />
              <Route path="journal"    element={<Journal />} />
              <Route path="expenses"   element={<Expenses />} />
            </Route>
          </Routes>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}