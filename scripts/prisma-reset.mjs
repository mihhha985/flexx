import { spawnSync } from "node:child_process";
import process from "node:process";
import readline from "node:readline/promises";
import { Client } from "pg";

const args = new Set(process.argv.slice(2));
const yes = args.has("--yes") || args.has("-y");
const skipSeed = args.has("--skip-seed");

function run(command, args) {
  const result = spawnSync(command, args, {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function databaseLabel(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ""}${parsed.pathname}`;
  } catch {
    return "(could not parse DATABASE_URL)";
  }
}

async function confirmReset(url) {
  if (yes) {
    return;
  }

  console.log("");
  console.log("This will permanently reset the Prisma database schemas:");
  console.log(`  ${databaseLabel(url)}`);
  console.log("");
  console.log("Schemas to drop:");
  console.log("  public");
  console.log("  prisma_contract");
  console.log("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = await rl.question('Type "reset" to continue: ');
    if (answer.trim() !== "reset") {
      console.log("Reset cancelled.");
      process.exit(0);
    }
  } finally {
    rl.close();
  }
}

async function resetSchemas(url) {
  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    await client.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      DROP SCHEMA IF EXISTS prisma_contract CASCADE;
      CREATE SCHEMA public;
    `);
  } finally {
    await client.end();
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing. Add it to .env first.");
    process.exit(1);
  }

  run("npm", ["run", "contract:emit"]);
  await confirmReset(databaseUrl);

  console.log("");
  console.log("Resetting database schemas...");
  await resetSchemas(databaseUrl);
  console.log("Database schemas reset.");
  console.log("");

  run("npm", ["run", "db:init"]);

  if (!skipSeed) {
    run("npm", ["run", "seed"]);
  }

  run("npm", ["run", "db:verify"]);
}

await main().catch((error) => {
  console.error(error);
  process.exit(1);
});
