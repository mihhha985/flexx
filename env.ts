import { loadEnvFile } from "node:process";

let envFileLoaded = false;

function loadLocalEnvFile() {
  if (envFileLoaded) {
    return;
  }

  try {
    loadEnvFile(".env");
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : undefined;

    if (code !== "ENOENT") {
      throw error;
    }
  }

  envFileLoaded = true;
}

export function getEnv(name: string): string | undefined {
  loadLocalEnvFile();

  return process.env[name];
}

export function getRequiredEnv(name: string): string {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const DATABASE_URL = getEnv("DATABASE_URL");
