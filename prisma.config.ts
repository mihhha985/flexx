import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

import { DATABASE_URL } from "./env.ts";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: DATABASE_URL,
    },
  }),
  composer: {
    configPath: "./prisma-composer.config.ts",
  },
});
