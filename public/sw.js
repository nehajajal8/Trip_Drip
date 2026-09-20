const CACHE_NAME = "tripdrip-maps-v1";
const TILE_CACHE = "tripdrip-tiles-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME && k !== TILE_CACHE).map(k => caches.delete(k)))
  ));
});

// Cache OpenStreetMap tiles and Leaflet assets for offline use
self.addEventListener("fetch", (e) => {
  const url = e.request.url;

  // Cache Leaflet library (css & js)
  if (url.includes("unpkg.com/leaflet")) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Cache OpenStreetMap map tiles
  if (url.includes("tile.openstreetmap.org")) {
    e.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
  }
});