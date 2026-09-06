import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"
import { SignJWT } from "jose"
import { loginSchema } from "./domain"
import { getAdminConfig, getAdminSessionVersion, verifyAdminCredentials } from "./repository/adminRepository"
import { createAdminToken, verifyAdminToken } from "./lib/sessionToken"
import { clearLoginAttempts, takeLoginAttempt } from "./lib/loginThrottle"

const testEnv = {
  ADMIN_LOGIN: "store-admin",
  ADMIN_PASSWORD: "test-password-1234",
  ADMIN_SESSION_SECRET: "test-session-secret-with-at-least-32-characters",
}
const originalEnv = Object.fromEntries(Object.keys(testEnv).map((name) => [name, process.env[name]]))
beforeEach(() => {
  Object.assign(process.env, testEnv)
  clearLoginAttempts()
})
afterEach(() => {
  for (const [name, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
})

test("validates credentials without trimming passwords or accepting a supplied role", () => {
  const input = loginSchema.parse({ login: " store-admin ", password: " secret ", role: "admin" })
  assert.deepEqual(input, { login: "store-admin", password: " secret " })
  assert.equal(loginSchema.safeParse({ login: " ", password: "x" }).success, false)
  assert.equal(loginSchema.safeParse({ login: "admin", password: "" }).success, false)
  assert.equal(loginSchema.safeParse({ login: "admin", password: "x".repeat(1025) }).success, false)
  assert.equal(verifyAdminCredentials("store-admin", "test-password-1234"), true)
  assert.equal(verifyAdminCredentials("store-admin", "incorrect"), false)
  assert.equal(verifyAdminCredentials("other", "test-password-1234"), false)
  assert.equal(verifyAdminCredentials("store-admin", " test-password-1234 "), false)
})

test("accepts a signed admin session and rejects tampered, empty and malformed cookies", async () => {
  const token = await createAdminToken()
  assert.deepEqual(await verifyAdminToken(token), { role: "admin", login: "store-admin" })
  const [header, payload, signature] = token.split(".")
  const modifiedPayload = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, "base64url").toString()), sub: "attacker" })).toString("base64url")
  assert.equal(await verifyAdminToken(`${header}.${modifiedPayload}.${signature}`), null)
  assert.equal(await verifyAdminToken(undefined), null)
  assert.equal(await verifyAdminToken("invalid"), null)
  assert.equal(await verifyAdminToken("x".repeat(4097)), null)
})

test("uses the configured password as-is and rejects empty configuration", () => {
  process.env.ADMIN_PASSWORD = "short"
  assert.equal(verifyAdminCredentials("store-admin", "short"), true)
  process.env.ADMIN_PASSWORD = ""
  assert.throws(() => getAdminConfig())
})

test("rejects expired tokens and signed tokens with the wrong role, audience or missing expiry", async () => {
  const config = getAdminConfig()
  for (const variant of ["expired", "role", "audience", "expiry", "algorithm"] as const) {
    let jwt = new SignJWT({ role: variant === "role" ? "customer" : "admin", version: getAdminSessionVersion(config) })
      .setProtectedHeader({ alg: variant === "algorithm" ? "HS384" : "HS256" })
      .setSubject("admin")
      .setIssuer("kontur")
      .setAudience(variant === "audience" ? "storefront" : "kontur-admin")
      .setIssuedAt()
    if (variant !== "expiry") jwt = jwt.setExpirationTime(variant === "expired" ? "-1s" : "8h")
    const token = await jwt.sign(new TextEncoder().encode(config.secret))
    assert.equal(await verifyAdminToken(token), null, variant)
  }
})

test("credential or secret rotation invalidates existing sessions; missing config fails closed", async () => {
  for (const name of ["ADMIN_LOGIN", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"] as const) {
    const previous = process.env[name]!
    const token = await createAdminToken()
    process.env[name] = previous + "-rotated"
    assert.equal(await verifyAdminToken(token), null)
    process.env[name] = previous
  }
  const token = await createAdminToken()
  process.env.ADMIN_SESSION_SECRET = ""
  assert.equal(await verifyAdminToken(token), null)
  assert.throws(() => verifyAdminCredentials("store-admin", "test-password-1234"))
})

test("limits repeated attempts and permits login after the window or a successful login", () => {
  for (let attempt = 0; attempt < 10; attempt++) assert.equal(takeLoginAttempt(1000), true)
  assert.equal(takeLoginAttempt(1001), false)
  assert.equal(takeLoginAttempt(301000), true)
  clearLoginAttempts()
  assert.equal(takeLoginAttempt(301001), true)
})
