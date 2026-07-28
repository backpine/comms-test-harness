import * as Alchemy from "alchemy";
import * as Drizzle from "alchemy/Drizzle";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
  "CommsTestHarnessMigrations",
  {
    providers: Drizzle.providers(),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const schema = yield* Drizzle.Schema("AppSchema", {
      schema: "./packages/db/src/schema.ts",
      out: "./packages/db/migrations",
      dialect: "sqlite",
    });

    return { migrationsDir: schema.out };
  }),
);
