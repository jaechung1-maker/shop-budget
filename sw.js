// Keeps the app available offline. Bump VERSION when any file changes.
const VERSION = "shopbudget-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Offline first: answer from the cache, refresh it in the background when online.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(event.request, { ignoreSearch: true }).then((hit) => {
        const net = fetch(event.request)
          .then((res) => { if (res.ok) cache.put(event.request, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      })
    )
  );
});
