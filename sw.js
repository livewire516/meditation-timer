// Sit — service worker. Cache-first so a sit never touches the network.
// Bump CACHE when any precached asset changes to force a refresh.
const CACHE = "sit-v2";

const ASSETS = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "audio/535950__mttvn__e-flat-tibetan-singing-bowl-struck.wav",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const isDocument =
    request.mode === "navigate" || request.destination === "document";

  if (isDocument) {
    // Network-first for the page itself: fresh when online, cached when offline.
    // Means editing the app just needs a redeploy — no cache-version dance.
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put("index.html", copy));
          return resp;
        })
        .catch(() =>
          caches.match(request, { ignoreSearch: true }).then(
            (cached) => cached || caches.match("index.html")
          )
        )
    );
    return;
  }

  // Cache-first for static assets (audio, icons, manifest) — never touch the
  // network mid-sit once cached.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resp) => {
        if (resp && resp.ok && new URL(request.url).origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return resp;
      });
    })
  );
});
