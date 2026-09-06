const CACHE_NAME = "kontur-v3"
const APP_SHELL = ["/", "/catalog", "/contacts", "/cart", "/manifest.webmanifest", "/icon.svg"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("kontur-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  // Never cache or serve private pages from the offline cache.
  if (url.pathname === "/auth" || url.pathname.startsWith("/auth/") ||
      url.pathname === "/panel" || url.pathname.startsWith("/panel/")) return

  // Next.js navigation payloads depend on router state and are not HTML pages.
  if (request.headers.has("RSC") || url.searchParams.has("_rsc") ||
      request.headers.has("Next-Router-Prefetch")) return

  const isDocument = request.mode === "navigate"
  const isAsset = ["style", "script", "image", "font", "manifest"].includes(request.destination)
  if (!isDocument && !isAsset) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && !response.redirected &&
            !/no-store|private/i.test(response.headers.get("Cache-Control") || "") &&
            (!isDocument || response.headers.get("Content-Type")?.includes("text/html"))) {
          const copy = response.clone()
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {}),
          )
        }
        return response
      })
      // A missing category or asset must never be replaced with the home page.
      .catch(() => caches.open(CACHE_NAME)
        .then((cache) => cache.match(request))
        .then((cached) => cached || Response.error())
        .catch(() => Response.error())),
  )
})
