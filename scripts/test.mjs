import { readdirSync } from "node:fs"
import { spawnSync } from "node:child_process"

const files = readdirSync("src", { recursive: true })
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => file.endsWith(".test.ts"))
  .map((file) => `src/${file}`)
const server = files.filter(
  (file) =>
    file.includes("/admin/") ||
    file.endsWith("proxy.test.ts") ||
    file.endsWith("create-order.test.ts"),
)
const client = files.filter((file) => !server.includes(file))
for (const args of [
  [
    "--import",
    "tsx",
    "--test",
    ...client,
    "scripts/service-worker.test.mjs",
    "scripts/architecture.test.mjs",
    "scripts/import-amazing-red.test.ts",
    "scripts/seed-orders.test.ts",
  ],
  ["--conditions=react-server", "--import", "tsx", "--test", ...server],
]) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
