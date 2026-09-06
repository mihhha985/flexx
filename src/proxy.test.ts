import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"
import { NextRequest } from "next/server"
import nextTesting from "next/experimental/testing/server"
import { ADMIN_SESSION_COOKIE } from "./entities/admin/domain"
import { createAdminToken } from "@/src/entities/admin/lib/session-token"
import { config, proxy } from "./proxy"

const testEnv = {
  ADMIN_LOGIN: "store-admin",
  ADMIN_PASSWORD: "test-password-1234",
  ADMIN_SESSION_SECRET: "test-session-secret-with-at-least-32-characters",
}
const originalEnv = Object.fromEntries(
  Object.keys(testEnv).map((name) => [name, process.env[name]]),
)
beforeEach(() => {
  Object.assign(process.env, testEnv)
})
afterEach(() => {
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
})

test("matcher covers nested panel routes without intercepting the shop or assets", () => {
  for (const url of ["/panel", "/panel/orders/1", "/auth", "/auth/"]) {
    assert.equal(
      nextTesting.unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }),
      true,
      url,
    )
  }
  for (const url of ["/", "/catalog", "/cart", "/panel-other", "/_next/static/app.js"]) {
    assert.equal(
      nextTesting.unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }),
      false,
      url,
    )
  }
})

test("redirects guests and forged sessions to login, including RSC and POST requests", async () => {
  for (const options of [
    undefined,
    { headers: { cookie: `${ADMIN_SESSION_COOKIE}=forged`, RSC: "1" } },
    { method: "POST" },
  ]) {
    const response = await proxy(new NextRequest("http://localhost/panel/orders/1", options))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get("location"), "http://localhost/auth")
    assert.equal(response.headers.get("cache-control"), "private, no-store")
    assert.equal(response.cookies.get(ADMIN_SESSION_COOKIE)?.value, "")
  }
})

test("allows authenticated panel access, redirects login GET, and allows login POST actions", async () => {
  const headers = { cookie: `${ADMIN_SESSION_COOKIE}=${await createAdminToken()}` }
  const panel = await proxy(new NextRequest("http://localhost/panel", { headers }))
  assert.equal(panel.headers.get("x-middleware-next"), "1")
  const auth = await proxy(new NextRequest("http://localhost/auth", { headers }))
  assert.equal(auth.headers.get("location"), "http://localhost/panel")
  const post = await proxy(new NextRequest("http://localhost/auth", { headers, method: "POST" }))
  assert.equal(post.headers.get("x-middleware-next"), "1")
})
