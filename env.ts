import { loadEnvFile } from "node:process"

let envFileLoaded = false

function loadLocalEnvFile() {
  if (envFileLoaded) {
    return
  }

  try {
    loadEnvFile(".env")
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error ? error.code : undefined

    if (code !== "ENOENT") {
      throw error
    }
  }

  envFileLoaded = true
}

function getEnv(name: string): string | undefined {
  loadLocalEnvFile()

  return process.env[name]
}

export const DATABASE_URL = getEnv("DATABASE_URL")

function getSiteUrl(): string {
  const value = getEnv("SITE_URL")?.trim() || "http://localhost:3000"
  const url = new URL(value)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https")
  }

  return url.origin
}

export const SITE_URL = getSiteUrl()
