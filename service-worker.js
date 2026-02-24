const CACHE_NAME = "ramadhan-app-v1a"; // ← ganti versi kalau update

const urlsToCache = [
  "/",
  "/app.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install
self.addEventListener("install", event => {
  self.skipWaiting(); // langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // hapus cache lama
          }
        })
      );
    })
  );
  self.clients.claim(); // langsung kontrol semua tab
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
      })
      .catch(() => caches.match(event.request))
  );
});

document.addEventListener("DOMContentLoaded", function(){

  if(!localStorage.getItem("installPopupShown")){

    setTimeout(function(){
      alert(
        "Pasang Aplikasi\n\n" +
        "Agar lebih mudah diakses, tambahkan aplikasi ini ke layar utama (Home Screen) HP Anda.\n\n" +
        "1. Tekan menu titik tiga di pojok kanan atas browser Chrome\n" +
        "2. Pilih menu 'Install App' atau 'Tambahkan ke Layar Utama'"
      );

      localStorage.setItem("installPopupShown","yes");

    }, 2000);

  }

});