import postgres from "@prisma/orm-postgres/runtime"

import "temporal-polyfill/global"

import service from "../../service.ts"
import type { Contract } from "./contract.d.ts"
import contractJson from "./contract.json" with { type: "json" }

function loadComposerDatabase() {
  try {
    return service.load().database.client
  } catch (error) {
    // Only standalone Next.js lacks a Composer binding. Invalid bindings must fail visibly.
    const standalone = !Object.keys(process.env).some((name) => name.startsWith("COMPOSER_"))
    if (
      standalone &&
      error instanceof Error &&
      error.message === 'missing required config param "url" (env COMPOSER_DATABASE_URL)'
    )
      return undefined
    throw error
  }
}

export const db =
  loadComposerDatabase() ??
  (process.env.DATABASE_URL
    ? postgres<Contract>({ contractJson, url: process.env.DATABASE_URL })
    : postgres<Contract>({ contractJson }))

let connection: Promise<void> | undefined

export function connectDatabase(): Promise<void> {
  connection ??= db
    .connect()
    .then(() => undefined)
    .catch((error: unknown) => {
      connection = undefined
      throw error
    })
  return connection
}
