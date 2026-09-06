import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import vm from "node:vm"

const source = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8")
const origin = "https://kontur.example"
const html = (body) => new Response(body, { headers: { "Content-Type": "text/html" } })
const offline = async () => {
  throw new TypeError("Network request failed")
}

function request(path, { mode, destination, ...options } = {}) {
  const result = new Request(new URL(path, origin), options)
  if (mode) Object.defineProperty(result, "mode", { value: mode })
  if (destination) Object.defineProperty(result, "destination", { value: destination })
  return result
}

function worker({ fetch = offline, failWrites = false } = {}) {
  const handlers = new Map()
  const stores = new Map()
  const cacheKey = (input) => new URL(typeof input === "string" ? input : input.url, origin).href
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name),
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map())
      const store = stores.get(name)
      return {
        addAll: async (urls) => {
          for (const url of urls) store.set(cacheKey(url), html("App shell"))
        },
        match: async (input) => store.get(cacheKey(input))?.clone(),
        put: async (input, response) => {
          if (failWrites) throw new Error("Cache full")
          store.set(cacheKey(input), response.clone())
        },
      }
    },
  }
  const cacheName = vm.runInNewContext(`${source}\nCACHE_NAME`, {
    URL,
    Response,
    caches,
    fetch,
    self: {
      location: { origin },
      addEventListener: (type, handler) => handlers.set(type, handler),
      clients: { claim: async () => {} },
      skipWaiting: async () => {},
    },
  })
  return {
    caches,
    cacheName,
    dispatch: async (type, req) => {
      const work = []
      let response
      handlers.get(type)({
        request: req,
        respondWith: (value) => {
          response = value
        },
        waitUntil: (value) => work.push(value),
      })
      const result = await response
      await Promise.all(work)
      return result
    },
  }
}

test("an uncached category never receives the cached home page when offline", async () => {
  const app = worker()
  const cache = await app.caches.open(app.cacheName)
  await cache.put("/", html("Home page"))
  const response = await app.dispatch(
    "fetch",
    request("/catalog/electronics", { mode: "navigate" }),
  )
  assert.equal(response.type, "error")
})

test("Next.js navigation and prefetch payloads bypass the service worker cache", async () => {
  const app = worker()
  for (const req of [
    request("/catalog/electronics?_rsc=abc"),
    request("/catalog/electronics", { headers: { RSC: "1" } }),
    request("/catalog/electronics", { headers: { "Next-Router-Prefetch": "1" } }),
  ]) {
    assert.equal(await app.dispatch("fetch", req), undefined)
  }
})

test("offline documents and assets fall back only to their own cached URL", async () => {
  let online = true
  const app = worker({ fetch: async () => (online ? html("Category page") : offline()) })
  const category = request("/catalog/electronics", { mode: "navigate" })
  assert.equal(await (await app.dispatch("fetch", category)).text(), "Category page")
  online = false
  assert.equal(await (await app.dispatch("fetch", category)).text(), "Category page")

  const cache = await app.caches.open(app.cacheName)
  await cache.put("/icon.svg", new Response("SVG"))
  assert.equal(
    await (await app.dispatch("fetch", request("/icon.svg", { destination: "image" }))).text(),
    "SVG",
  )
  assert.equal(
    (await app.dispatch("fetch", request("/missing.js", { destination: "script" }))).type,
    "error",
  )
})

test("API, cross-origin and non-GET requests are not intercepted", async () => {
  const app = worker()
  for (const req of [
    request("/api/products"),
    request("https://other.example/image.png", { destination: "image" }),
    request("/catalog/electronics", { method: "POST" }),
  ]) {
    assert.equal(await app.dispatch("fetch", req), undefined)
  }
})

test("cache write failures do not replace a successful network response", async () => {
  const app = worker({ fetch: async () => html("Category page"), failWrites: true })
  const response = await app.dispatch(
    "fetch",
    request("/catalog/electronics", { mode: "navigate" }),
  )
  assert.equal(await response.text(), "Category page")
})

test("redirects and RSC responses cannot be stored as category HTML", async () => {
  for (const response of [
    html("Redirected home"),
    new Response("RSC", { headers: { "Content-Type": "text/x-component" } }),
  ]) {
    if (response.headers.get("Content-Type") === "text/html") {
      Object.defineProperty(response, "redirected", { value: true })
    }
    const app = worker({ fetch: async () => response })
    const category = request("/catalog/electronics", { mode: "navigate" })
    await app.dispatch("fetch", category)
    const cache = await app.caches.open(app.cacheName)
    assert.equal(await cache.match(category), undefined)
  }
})

test("activation removes old app caches and preserves unrelated caches", async () => {
  const app = worker()
  for (const name of ["kontur-v1", "kontur-v2", app.cacheName, "other-app"])
    await app.caches.open(name)
  await app.dispatch("activate")
  assert.deepEqual(await app.caches.keys(), [app.cacheName, "other-app"])
})

test("private routes bypass the cache and private responses are not stored", async () => {
  const app = worker({
    fetch: async () =>
      new Response("private", {
        headers: { "Content-Type": "text/html", "Cache-Control": "private, no-store" },
      }),
  })
  for (const path of ["/auth", "/auth/nested", "/panel", "/panel/orders"]) {
    assert.equal(await app.dispatch("fetch", request(path, { mode: "navigate" })), undefined)
  }
  const req = request("/order/confirmation", { mode: "navigate" })
  await app.dispatch("fetch", req)
  assert.equal(await (await app.caches.open(app.cacheName)).match(req), undefined)
})

test("install preloads only the public app shell", async () => {
  const app = worker()
  await app.dispatch("install")
  const cache = await app.caches.open(app.cacheName)
  assert.ok(await cache.match("/catalog"))
  assert.equal(await cache.match("/panel"), undefined)
  assert.equal(await cache.match("/auth"), undefined)
})
