import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import Backend from "./apps/api/src/backend.ts";
import Api from "./apps/api/src/worker.ts";
import { Database } from "./packages/db/src/database.ts";

export class Website extends Cloudflare.Website.Vite<Website>()("Website", {
  rootDir: "./apps/web",
  compatibility: {
    date: "2026-07-28",
    flags: ["nodejs_compat", "enable_request_signal"],
  },
  env: {
    BACKEND: Backend,
  },
  assets: {
    runWorkerFirst: true,
  },
  dev: {
    port: 3000,
  },
}) {}

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>;

export default Alchemy.Stack(
  "CommsTestHarness",
  {
    providers: Layer.mergeAll(Cloudflare.providers(), Drizzle.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const database = yield* Database;
    const api = yield* Api;
    const website = yield* Website;

    return {
      apiUrl: api.url,
      databaseName: database.databaseName,
      websiteUrl: website.url,
    };
  }),
);
