import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import readline from "node:readline/promises"
import { Client } from "pg"

const args = new Set(process.argv.slice(2))
const yes = args.has("--yes") || args.has("-y")
const skipSeed = args.has("--skip-seed")
const isWindows = process.platform === "win32"

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    env: process.env,
    shell: options.shell ?? false,
    stdio: "inherit",
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function runNpmScript(script) {
  const bundledNpmCli = path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js")
  const npmCliPath = process.env.npm_execpath || (existsSync(bundledNpmCli) ? bundledNpmCli : null)

  if (npmCliPath) {
    run(process.execPath, [npmCliPath, "run", script])
    return
  }

  run(isWindows ? "npm.cmd" : "npm", ["run", script], { shell: isWindows })
}

function databaseLabel(url) {
  try {
    const parsed = new URL(url)
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}${parsed.pathname}`
  } catch {
    return "(could not parse DATABASE_URL)"
  }
}

async function confirmReset(url) {
  if (yes) {
    return
  }

  console.log("")
  console.log("This will permanently reset the Prisma database schemas:")
  console.log(`  ${databaseLabel(url)}`)
  console.log("")
  console.log("Schemas to drop:")
  console.log("  public")
  console.log("  prisma_contract")
  console.log("")

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = await rl.question('Type "reset" to continue: ')
    if (answer.trim() !== "reset") {
      console.log("Reset cancelled.")
      process.exit(0)
    }
  } finally {
    rl.close()
  }
}

async function resetSchemas(url) {
  const client = new Client({ connectionString: url })
  await client.connect()

  try {
    await client.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      DROP SCHEMA IF EXISTS prisma_contract CASCADE;
      CREATE SCHEMA public;
    `)
  } finally {
    await client.end()
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing. Add it to .env first.")
    process.exit(1)
  }

  runNpmScript("contract:emit")
  await confirmReset(databaseUrl)

  console.log("")
  console.log("Resetting database schemas...")
  await resetSchemas(databaseUrl)
  console.log("Database schemas reset.")
  console.log("")

  runNpmScript("db:init")

  if (!skipSeed) {
    runNpmScript("seed")
  }

  runNpmScript("db:verify")
}

await main().catch((error) => {
  console.error(error)
  process.exit(1)
})
