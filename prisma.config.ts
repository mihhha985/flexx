import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: "postgres://24b151e7c2a28f4b2a90aefa9f151e1654f25028aa7231da689cd4ab89f32733:sk_-tchu5cl3Wv6AVV9y3tGL@db.prisma.io:5432/postgres?sslmode=require",
    },
  }),
  composer: {
    configPath: "./prisma-composer.config.ts",
  },
});
