import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = join(".next", "standalone");

if (!existsSync(standaloneDir)) {
  throw new Error("Standalone output is missing. Check output: 'standalone' in next.config.ts.");
}

const staticSource = join(".next", "static");
const staticTarget = join(standaloneDir, ".next", "static");

mkdirSync(join(standaloneDir, ".next"), { recursive: true });
cpSync(staticSource, staticTarget, { recursive: true, force: true });

if (existsSync("public")) {
  cpSync("public", join(standaloneDir, "public"), { recursive: true, force: true });
}
