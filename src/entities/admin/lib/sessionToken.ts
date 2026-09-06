import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { ADMIN_SESSION_SECONDS } from "../domain"
import { getAdminConfig, getAdminSessionVersion } from "../repository/adminRepository"

const issuer = "kontur"
const audience = "kontur-admin"

export async function createAdminToken() {
  const config = getAdminConfig()
  return new SignJWT({ role: "admin", version: getAdminSessionVersion(config) })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject("admin")
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_SECONDS}s`)
    .sign(new TextEncoder().encode(config.secret))
}

export async function verifyAdminToken(token: string | undefined) {
  if (!token || token.length > 4096) return null
  try {
    const config = getAdminConfig()
    const { payload } = await jwtVerify(token, new TextEncoder().encode(config.secret), {
      algorithms: ["HS256"],
      issuer,
      audience,
      requiredClaims: ["sub", "iat", "exp"],
      maxTokenAge: `${ADMIN_SESSION_SECONDS}s`,
    })
    if (payload.sub !== "admin" || payload.role !== "admin" ||
        payload.version !== getAdminSessionVersion(config)) return null
    return { role: "admin" as const, login: config.login }
  } catch {
    return null
  }
}
