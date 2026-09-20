/**
 * src/services/offlineStorage.js
 * IndexedDB storage layer for caching Trip Drip itineraries, outfits, checklists,
 * shopping cart, journal, and expenses for offline usage.
 */

const DB_NAME = "trip_drip_offline_db";
const DB_VERSION = 2;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      const stores = [
        "trips",
        "wardrobe",
        "checklist",
        "cart",
        "journal",
        "expenses",
        "squad"
      ];
      stores.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      });
      if (!db.objectStoreNames.contains("map_tiles")) {
        db.createObjectStore("map_tiles", { keyPath: "key" });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.warn("IndexedDB open failed:", e.target.error);
      resolve(null);
    };
  });
}

// ── Generic IDB helpers ──
async function idbPut(storeName, item) {
  const db = await openDB();
  if (!db) {
    try {
      localStorage.setItem(`idb_fallback_${storeName}_${item.id}`, JSON.stringify(item));
    } catch {}
    return item;
  }
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve(item);
      tx.onerror = () => resolve(item);
    } catch (e) {
      resolve(item);
    }
  });
}

async function idbGet(storeName, id) {
  const db = await openDB();
  if (!db) {
    try {
      const v = localStorage.getItem(`idb_fallback_${storeName}_${id}`);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGetAll(storeName) {
  const db = await openDB();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

// ── Trips cache ──
export async function cacheTripOffline(trip) {
  if (!trip?.id) return;
  return idbPut("trips", { ...trip, _cachedAt: Date.now() });
}

export async function getCachedTrip(id) {
  return idbGet("trips", id);
}

export async function getAllCachedTrips() {
  return idbGetAll("trips");
}

export async function deleteCachedTrip(tripId) {
  if (!tripId) return;
  const db = await openDB();
  const stores = ["trips", "checklist", "cart", "journal", "expenses", "squad"];

  if (!db) {
    stores.forEach((s) => {
      try {
        localStorage.removeItem(`idb_fallback_${s}_${tripId}`);
      } catch {}
    });
    return true;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(stores, "readwrite");
      stores.forEach((storeName) => {
        try {
          const store = tx.objectStore(storeName);
          store.delete(tripId);
        } catch {}
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(true);
    } catch {
      resolve(true);
    }
  });
}

// ── Packing Checklist cache ──
export async function cacheChecklistOffline(tripId, items) {
  return idbPut("checklist", { id: tripId, items, _cachedAt: Date.now() });
}

export async function getCachedChecklist(tripId) {
  const res = await idbGet("checklist", tripId);
  return res?.items || null;
}

// ── Shopping Cart cache ──
export async function cacheCartOffline(tripId, cartItems) {
  return idbPut("cart", { id: tripId, items: cartItems, _cachedAt: Date.now() });
}

export async function getCachedCart(tripId) {
  const res = await idbGet("cart", tripId);
  return res?.items || [];
}

// ── Journal cache ──
export async function cacheJournalOffline(tripId, entries) {
  return idbPut("journal", { id: tripId, entries, _cachedAt: Date.now() });
}

export async function getCachedJournal(tripId) {
  const res = await idbGet("journal", tripId);
  return res?.entries || null;
}

// ── Expenses cache ──
export async function cacheExpensesOffline(tripId, expenses) {
  return idbPut("expenses", { id: tripId, expenses, _cachedAt: Date.now() });
}

export async function getCachedExpenses(tripId) {
  const res = await idbGet("expenses", tripId);
  return res?.expenses || null;
}

// ── Squad Collaborators cache ──
export async function cacheSquadOffline(tripId, members) {
  return idbPut("squad", { id: tripId, members, _cachedAt: Date.now() });
}

export async function getCachedSquad(tripId) {
  const res = await idbGet("squad", tripId);
  return res?.members || null;
}

// ── Network status listener ──
export function subscribeNetworkStatus(callback) {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

export function isOnlineNow() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

// ── Map Tiles Offline Cache ──
export async function cacheMapTile(key, dataUrl) {
  const db = await openDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction("map_tiles", "readwrite");
      const store = tx.objectStore("map_tiles");
      store.put({ key, dataUrl, cachedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function getCachedMapTile(key) {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction("map_tiles", "readonly");
      const store = tx.objectStore("map_tiles");
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.dataUrl || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function getCachedMapTileCount() {
  const db = await openDB();
  if (!db) return 0;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction("map_tiles", "readonly");
      const store = tx.objectStore("map_tiles");
      const req = store.count();
      req.onsuccess = () => resolve(req.result || 0);
      req.onerror = () => resolve(0);
    } catch {
      resolve(0);
    }
  });
}

// Coordinate to tile math
function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

/**
 * Pre-fetch and cache OpenStreetMap tiles for destination at zoom levels 12, 13, 14
 * Calls onProgress(percent, count, total) callback
 */
export async function cacheDestinationTiles(lat, lng, onProgress) {
  if (typeof window === "undefined" || !lat || !lng) return { cached: 0, total: 0 };

  const zoomLevels = [12, 13, 14];
  const tileCoords = [];

  zoomLevels.forEach(z => {
    const cx = lon2tile(lng, z);
    const cy = lat2tile(lat, z);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        tileCoords.push({ z, x: cx + dx, y: cy + dy });
      }
    }
  });

  const total = tileCoords.length;
  let cachedCount = 0;

  for (let i = 0; i < tileCoords.length; i++) {
    const { z, x, y } = tileCoords[i];
    const key = `${z}/${x}/${y}`;
    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

    try {
      // Check if already cached
      const existing = await getCachedMapTile(key);
      if (!existing) {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onloadend = async () => {
              if (reader.result) {
                await cacheMapTile(key, reader.result);
              }
              resolve();
            };
            reader.readAsDataURL(blob);
          });
        }
      }
      cachedCount++;
      if (onProgress) {
        onProgress(Math.round(((i + 1) / total) * 100), i + 1, total);
      }
    } catch (err) {
      console.warn(`Tile caching failed for ${key}:`, err);
    }
  }

  return { cached: cachedCount, total };
}
