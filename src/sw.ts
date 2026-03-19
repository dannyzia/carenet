/**
 * CareNet Service Worker — per D016 §8.1
 *
 * Caching strategies:
 *   1. Cache-first for app shell (HTML, CSS, JS, fonts)
 *   2. Stale-while-revalidate for route chunks
 *   3. Network-first for API requests
 *
 * NOTE: In this Figma Make environment, the service worker is defined
 * but not registered via vite.config.ts. It serves as the blueprint
 * for production deployment with Workbox or similar.
 */

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "carenet-v1";
const APP_SHELL_CACHE = "carenet-shell-v1";
const API_CACHE = "carenet-api-v1";

const APP_SHELL_URLS = [
  "/",
  "/index.html",
];

/* ── Install: pre-cache app shell ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS);
    })
  );
  self.skipWaiting();
});

/* ── Activate: clean old caches ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE && key !== API_CACHE && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* ── Fetch: strategy-based routing ── */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // API requests: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  // Navigation / HTML: stale-while-revalidate (SPA routing)
  if (event.request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(event.request, APP_SHELL_CACHE));
    return;
  }

  // Default: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(event.request, CACHE_NAME));
});

/* ── Caching Strategies ── */

async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request: Request, cacheName: string): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(cacheName).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached || new Response("Offline", { status: 503 }));

  return cached || fetchPromise;
}

/* ── Helpers ── */

function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico|webp)$/.test(pathname);
}

export {};
