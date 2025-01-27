const CACHE_NAME = "ipm-calculator-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add other assets (CSS, JS, images) that should be cached
]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
})

