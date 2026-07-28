import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import * as Effect from "effect/Effect";

export const Database = Effect.gen(function* () {
  const schema = yield* Drizzle.Schema("AppSchema", {
    schema: "./packages/db/src/schema.ts",
    out: "./packages/db/migrations",
    dialect: "sqlite",
  });

  return yield* Cloudflare.D1.Database("AppDatabase", {
    migrationsDir: schema.out,
    migrationsTable: "drizzle_migrations",
  });
});
