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
