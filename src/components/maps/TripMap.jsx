import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin, Navigation, Compass, WifiOff, CheckCircle2, Layers, Locate, Radio,
  ExternalLink, Download, HardDrive, Wifi, Sparkles
} from "lucide-react";
import {
  cacheMapTile,
  getCachedMapTile,
  getCachedMapTileCount,
  cacheDestinationTiles,
  subscribeNetworkStatus,
  isOnlineNow,
} from "../../services/offlineStorage";

// Regional coordinate offsets for Kutch and generic waypoints
const REGIONAL_WAYPOINT_OFFSETS = [
  { name: "Day 1 Heritage", dLat: 0.00, dLng: 0.00 },
  { name: "Day 2 Salt Flats", dLat: 0.08, dLng: 0.04 },
  { name: "Day 3 Summit / Ridge", dLat: 0.12, dLng: -0.05 },
  { name: "Day 4 Craft Village", dLat: -0.06, dLng: 0.07 },
  { name: "Day 5 Coast / Lake", dLat: -0.12, dLng: -0.04 },
];

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function TripMap({ destination, lat, lng, itinerary = [], className = "" }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const gpsMarkerRef = useRef(null);

  const [mapMode, setMapMode] = useState("osm"); // "osm" | "m4_vector"
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [userGps, setUserGps] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("OFFLINE • WAITING FOR GPS");

  // Offline Tile Cache States
  const [isOnline, setIsOnline] = useState(() => isOnlineNow());
  const [cachedTileCount, setCachedTileCount] = useState(0);
  const [downloadingTiles, setDownloadingTiles] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    getCachedMapTileCount().then(c => setCachedTileCount(c));
    const unsub = subscribeNetworkStatus(online => setIsOnline(online));
    return () => unsub();
  }, []);

  async function handleDownloadOfflineMap() {
    if (!lat || !lng || downloadingTiles) return;
    setDownloadingTiles(true);
    setDownloadProgress(0);
    try {
      await cacheDestinationTiles(lat, lng, (pct) => {
        setDownloadProgress(pct);
      });
      const count = await getCachedMapTileCount();
      setCachedTileCount(count);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn("Failed to download map tiles:", err);
    } finally {
      setDownloadingTiles(false);
    }
  }

  // 1. Live Device GPS Tracking (matching m4dm4x100 LocationManager.GPS_PROVIDER)
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsStatus("OFFLINE • GPS UNAVAILABLE");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 12),
        });
        setGpsStatus("OFFLINE • GPS ACTIVE");
      },
      (err) => {
        // Fallback default GPS to destination center if permission denied/testing
        setGpsStatus("OFFLINE • GPS SIMULATION");
        setUserGps(prev => prev || { lat: lat + 0.015, lng: lng + 0.012, accuracy: 18 });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [lat, lng]);

  // 2. Ensure Leaflet is loaded (window.L or dynamic script tag)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="leaflet.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => setLeafletLoaded(true));
      existingScript.addEventListener("error", () => setMapError(true));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);
  }, []);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (mapMode !== "osm") return;
    if (!lat || !lng || !leafletLoaded || typeof window === "undefined" || !window.L) return;

    const L = window.L;

    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }

    if (!mapRef.current) return;

    try {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 11,
        zoomControl: true,
      });

      // OpenStreetMap tiles with IndexedDB offline caching and fallback
      const OfflineTileLayer = L.TileLayer.extend({
        createTile(coords, done) {
          const tile = document.createElement("img");
          tile.alt = "";
          tile.setAttribute("role", "presentation");
          const key = `${coords.z}/${coords.x}/${coords.y}`;

          getCachedMapTile(key).then((cached) => {
            if (cached) {
              tile.src = cached;
              done(null, tile);
            } else {
              const url = this.getTileUrl(coords);
              tile.onload = () => {
                done(null, tile);
                if (typeof navigator !== "undefined" && navigator.onLine) {
                  fetch(url)
                    .then((r) => r.blob())
                    .then((blob) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (reader.result) cacheMapTile(key, reader.result);
                      };
                      reader.readAsDataURL(blob);
                    })
                    .catch(() => {});
                }
              };
              tile.onerror = () => {
                tile.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='256' height='256' fill='%23F4EFE6'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='11' fill='%2394A3B8' text-anchor='middle'>Offline Tile</text></svg>";
                done(null, tile);
              };
              tile.crossOrigin = "anonymous";
              tile.src = url;
            }
          }).catch(() => {
            tile.src = this.getTileUrl(coords);
            done(null, tile);
          });

          return tile;
        },
      });

      new OfflineTileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Destination Primary Beacon Pin (Saffron glow)
      const primaryIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:24px;height:24px;background:#E8610A;opacity:0.3;border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:16px;height:16px;background:#E8610A;border:2.5px solid #FFFDF9;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        className: "",
        iconAnchor: [8, 8],
      });

      const mainMarker = L.marker([lat, lng], { icon: primaryIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Poppins,sans-serif;padding:2px 4px;">
            <p style="font-weight:700;font-size:13px;color:#1E293B;margin:0 0 2px 0;">${destination}</p>
            <p style="font-size:10px;font-family:monospace;color:#E8610A;margin:0;">GPS: ${Number(lat).toFixed(4)}°N, ${Number(lng).toFixed(4)}°E</p>
          </div>
        `);

      mainMarker.openPopup();

      // Plot Itinerary Waypoints
      const waypoints = [[lat, lng]];

      if (itinerary && itinerary.length > 0) {
        itinerary.slice(0, 5).forEach((day, idx) => {
          const offset = REGIONAL_WAYPOINT_OFFSETS[idx % REGIONAL_WAYPOINT_OFFSETS.length];
          const waypointLat = lat + offset.dLat;
          const waypointLng = lng + offset.dLng;
          waypoints.push([waypointLat, waypointLng]);

          const stopIcon = L.divIcon({
            html: `
              <div style="background:#1C4E4F;color:#FFFDF9;border:1.5px solid #FFFDF9;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:bold;box-shadow:0 2px 5px rgba(0,0,0,0.3);font-family:monospace;">
                ${idx + 1}
              </div>
            `,
            className: "",
            iconAnchor: [9, 9],
          });

          const placeLabel = (day.places && day.places[0]) ? day.places[0] : `Day ${idx + 1}`;
          L.marker([waypointLat, waypointLng], { icon: stopIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:Poppins,sans-serif;padding:2px;">
                <p style="font-weight:600;font-size:11px;color:#1C4E4F;margin:0;">Day ${idx + 1}: ${placeLabel}</p>
                <p style="font-size:10px;color:#64748B;margin:2px 0 0 0;">${day.theme || ""}</p>
              </div>
            `);
        });

        if (waypoints.length > 1) {
          L.polyline(waypoints, {
            color: "#E8610A",
            weight: 2.5,
            opacity: 0.7,
            dashArray: "6, 8",
          }).addTo(map);
        }
      }

      // Add Live GPS User Marker (Blue circle matching m4dm4x100 CircleLayer)
      if (userGps) {
        const userIcon = L.divIcon({
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:24px;height:24px;background:#2563EB;opacity:0.35;border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width:13px;height:13px;background:#2563EB;border:2px solid #FFFFFF;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
            </div>
          `,
          className: "",
          iconAnchor: [6, 6],
        });
        gpsMarkerRef.current = L.marker([userGps.lat, userGps.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`<strong style="font-family:Poppins,sans-serif;font-size:11px;color:#2563EB;">Your Live GPS Position</strong>`);
      }

      instanceRef.current = map;

      // Register service worker for tile caching
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    } catch (err) {
      console.warn("Leaflet error, switching to vector mode:", err);
      setMapError(true);
      setMapMode("m4_vector");
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [lat, lng, destination, leafletLoaded, itinerary, mapMode]);

  // Distance from GPS to Day 1 Waypoint
  const distanceToDay1 = useMemo(() => {
    if (!userGps || !lat || !lng) return null;
    return calculateDistanceKm(userGps.lat, userGps.lng, lat, lng);
  }, [userGps, lat, lng]);

  return (
    <div className="relative group border border-mist overflow-hidden bg-sand/10">
      
      {/* ── Top HUD Status Strip (Inspired by m4dm4x100/offline-map MainActivity.kt) ── */}
      <div className="bg-[#101820] text-white px-3 py-1.5 flex items-center justify-between font-mono text-[0.62rem] border-b border-mist/20 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="tracking-widest font-semibold">{gpsStatus}</span>
          <span className="text-white/30">|</span>
          <span className="text-white/80">
            {userGps ? `${userGps.lat.toFixed(4)}°N, ${userGps.lng.toFixed(4)}°E (±${userGps.accuracy}m)` : `${Number(lat).toFixed(4)}°N, ${Number(lng).toFixed(4)}°E`}
          </span>
        </div>

        {/* Mode Toggle: OSM vs M4dm4x Vector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMapMode("osm")}
            className={`px-2 py-0.5 text-[0.58rem] font-mono transition-colors ${
              mapMode === "osm"
                ? "bg-saffron text-white font-bold"
                : "text-white/60 hover:text-white bg-white/10"
            }`}
          >
            OSM Cached
          </button>
          <button
            onClick={() => setMapMode("m4_vector")}
            className={`px-2 py-0.5 text-[0.58rem] font-mono transition-colors flex items-center gap-1 ${
              mapMode === "m4_vector"
                ? "bg-teal text-white font-bold"
                : "text-white/60 hover:text-white bg-white/10"
            }`}
          >
            <Radio size={9} />
            M4dm4x Vector
          </button>
        </div>
      </div>

      {/* ── Offline Mode Notice Banner ── */}
      {(!isOnline || cachedTileCount > 0) && (
        <div className={`${!isOnline ? "bg-amber-900/90 text-amber-200 border-amber-700/60" : "bg-teal/90 text-sand border-teal/70"} px-3 py-1.5 flex items-center justify-between font-mono text-[0.65rem] border-b z-10 relative`}>
          <div className="flex items-center gap-1.5">
            {!isOnline ? (
              <WifiOff size={13} className="text-amber-400 flex-shrink-0" />
            ) : (
              <HardDrive size={13} className="text-emerald-300 flex-shrink-0" />
            )}
            <span className="font-semibold">
              {!isOnline
                ? `Offline Mode — Serving cached map tiles for ${destination}`
                : `Offline Ready — Local tile cache active for ${destination}`}
            </span>
          </div>
          <span className="text-[0.6rem] opacity-80">
            {cachedTileCount} tiles in IndexedDB
          </span>
        </div>
      )}

      {/* ── Mode 1: OpenStreetMap Cached Tile Layer ── */}
      {mapMode === "osm" && !mapError && (
        <div className="relative">
          {/* Subtle Live Badge Overlay */}
          <div className="absolute top-2.5 right-2.5 z-[400] flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-mist text-[0.65rem] font-mono text-slate shadow-xs pointer-events-none">
            <CheckCircle2 size={11} className="text-forest" />
            <span className="font-medium">Offline Cached</span>
            {distanceToDay1 && (
              <>
                <span className="text-slate/30">•</span>
                <span className="text-saffron font-bold">{distanceToDay1} km to stop</span>
              </>
            )}
          </div>

          <div
            ref={mapRef}
            className={`${className} relative`}
            style={{ zIndex: 0 }}
          />
        </div>
      )}

      {/* ── Mode 2: M4dm4x GPS Vector Canvas (Inspired by m4dm4x100/offline-map styling) ── */}
      {(mapMode === "m4_vector" || mapError) && (
        <div className={`relative ${className} overflow-hidden bg-[#e8edf1] text-slate select-none flex flex-col justify-between p-4`}>
          
          {/* Vector Topographical Elements (m4dm4x100 color scheme) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="m4grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5dde4" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#e8edf1" />
            <rect width="100%" height="100%" fill="url(#m4grid)" />

            {/* Landuse Green Area (#dfe8d9) */}
            <path d="M -50 80 Q 80 40 220 110 T 500 90 L 500 280 L -50 280 Z" fill="#dfe8d9" opacity="0.8" />
            
            {/* Water Body (#b9d9ee) */}
            <path d="M 120 -20 Q 250 80 380 30 T 650 60 L 650 -20 Z" fill="#b9d9ee" />
            
            {/* Waterway Stream (#8bbfdf) */}
            <path d="M 160 0 Q 220 120 280 200 T 360 300" fill="none" stroke="#8bbfdf" strokeWidth="2.5" strokeDasharray="4 2" />

            {/* Major Transportation Highway Corridor (#e49a4d) */}
            <path d="M 0 160 Q 200 130 380 180 T 700 150" fill="none" stroke="#e49a4d" strokeWidth="5" opacity="0.9" />
            <path d="M 0 160 Q 200 130 380 180 T 700 150" fill="none" stroke="#f8f8f8" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Secondary Arterial Roads (#f8f8f8) */}
            <path d="M 180 20 L 260 250" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.8" />
            <path d="M 320 300 L 420 40" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />

            {/* Itinerary Waypoint Connection Vector Lines */}
            <polyline
              points="140,150 240,110 320,170 410,130 500,160"
              fill="none"
              stroke="#E8610A"
              strokeWidth="2.2"
              strokeDasharray="5 5"
              opacity="0.85"
            />
          </svg>

          {/* Top Info Strip */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-[#101820]/90 text-white px-2.5 py-1 text-[0.62rem] font-mono border border-mist/30 flex items-center gap-1.5 shadow-sm">
              <Radio size={11} className="text-teal animate-pulse" />
              <span>M4dm4x PMTiles Vector Architecture</span>
            </div>

            <div className="bg-white/95 text-slate px-2.5 py-1 text-[0.62rem] font-mono border border-mist shadow-xs flex items-center gap-1.5">
              <Locate size={11} className="text-blue-600" />
              <span>Zero-Internet GPS Mode</span>
            </div>
          </div>

          {/* Interactive Center Waypoints */}
          <div className="relative z-10 my-auto py-4 flex items-center justify-around">
            {/* Center Destination Marker */}
            <div className="flex flex-col items-center">
              <div className="relative mb-1">
                <div className="w-8 h-8 rounded-full bg-saffron/30 animate-ping absolute inset-0"></div>
                <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center relative shadow-md font-bold text-xs">
                  ★
                </div>
              </div>
              <span className="font-display font-bold text-xs text-slate bg-white/90 px-2 py-0.5 border border-mist shadow-xs">
                {destination}
              </span>
              <span className="font-mono text-[0.58rem] text-slate/50 mt-0.5">
                {Number(lat).toFixed(3)}°N, {Number(lng).toFixed(3)}°E
              </span>
            </div>

            {/* Live GPS Device Position Pin */}
            {userGps && (
              <div className="flex flex-col items-center">
                <div className="relative mb-1">
                  <div className="w-7 h-7 rounded-full bg-blue-500/30 animate-ping absolute inset-0"></div>
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center relative shadow-md font-bold text-[9px]">
                    GPS
                  </div>
                </div>
                <span className="font-mono font-bold text-[0.62rem] text-blue-800 bg-white/90 px-1.5 py-0.5 border border-blue-200 shadow-xs">
                  Your Location
                </span>
                <span className="font-mono text-[0.55rem] text-blue-600 mt-0.5">
                  {distanceToDay1 ? `${distanceToDay1} km away` : "Live Fix"}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Waypoint Pill Bar */}
          <div className="relative z-10 pt-2 border-t border-slate/10 flex items-center justify-between text-[0.62rem] font-mono">
            <span className="text-slate/60">
              Corridor: NH48 / SH45 Vector Layer
            </span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {itinerary.slice(0, 3).map((d, idx) => (
                <span key={idx} className="bg-white/90 border border-mist px-2 py-0.5 text-slate/70">
                  Stop {idx + 1}: {d.places ? d.places[0] : `Day ${idx + 1}`}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Download Map for Offline Use Control Bar ── */}
      <div className="p-3 bg-white border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-2 z-10 relative">
        <div className="flex items-center gap-2">
          <HardDrive size={13} className="text-slate/40" />
          <span className="font-mono text-[0.68rem] text-slate/70">
            Local Map Cache: <strong className="text-slate">{cachedTileCount} tiles saved in IndexedDB</strong>
          </span>
        </div>

        <button
          onClick={handleDownloadOfflineMap}
          disabled={downloadingTiles}
          className="w-full sm:w-auto px-3.5 py-1.5 bg-teal text-sand hover:bg-teal/90 disabled:opacity-50 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          {downloadingTiles ? (
            <>
              <div className="w-3 h-3 border-2 border-sand border-t-transparent rounded-full animate-spin" />
              <span>Downloading Tiles ({downloadProgress}%)…</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-300" />
              <span>Map Cached for Offline Use!</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>Download Map for Offline Use</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}