import "server-only"

import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { z } from "zod"

const configSchema = z.object({
  login: z.string().trim().min(1).max(254),
  password: z.string().min(1).max(1024),
  secret: z.string().min(32),
})

export function getAdminConfig() {
  const result = configSchema.safeParse({
    login: process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SESSION_SECRET,
  })
  if (!result.success) {
    throw new Error("Настройте ADMIN_LOGIN, ADMIN_PASSWORD и ADMIN_SESSION_SECRET")
  }
  return result.data
}

export function getAdminSessionVersion(config: ReturnType<typeof getAdminConfig>) {
  // Changing either credential invalidates previously issued sessions.
  return createHmac("sha256", config.secret)
    .update(JSON.stringify([config.login, config.password]))
    .digest("hex")
}

export function verifyAdminCredentials(login: string, password: string): boolean {
  const config = getAdminConfig()
  const digest = (value: string) => createHash("sha256").update(value).digest()
  const loginMatches = timingSafeEqual(digest(login), digest(config.login))
  const passwordMatches = timingSafeEqual(digest(password), digest(config.password))
  return loginMatches && passwordMatches
}
