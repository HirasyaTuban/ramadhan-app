const CACHE_NAME = "ramadhan-app-v4g";
const urlsToCache = [
  "/",
  "/app.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

async function cacheFiles(cacheName, files) {
  const cache = await caches.open(cacheName);
  for (const file of files) {
    try { await cache.add(file); }
    catch(err) { console.warn("Gagal cache file:", file, err); }
  }
}

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(cacheFiles(CACHE_NAME, urlsToCache));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => caches.open(CACHE_NAME)
        .then(cache => { cache.put(event.request, response.clone()); return response; })
      )
      .catch(() => caches.match(event.request))
  );
});