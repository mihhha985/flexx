import { cp, mkdir, rm } from "node:fs/promises"

const standaloneDir = ".next/standalone"
const assets = [
  { source: "public", target: `${standaloneDir}/public` },
  { source: ".next/static", target: `${standaloneDir}/.next/static` },
]

await mkdir(`${standaloneDir}/.next`, { recursive: true })

for (const { source, target } of assets) {
  await rm(target, { recursive: true, force: true })
  await cp(source, target, { recursive: true })
}
