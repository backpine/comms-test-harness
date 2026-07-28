import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import Api from "./apps/api/src/worker.ts";
import { Database } from "./packages/db/src/database.ts";

export class Website extends Cloudflare.Website.Vite<Website>()("Website", {
  rootDir: "./apps/web",
  compatibility: {
    date: "2026-07-28",
  },
  env: {
    BACKEND: Api,
  },
  assets: {
    runWorkerFirst: ["/rpc", "/rpc/*"],
    notFoundHandling: "single-page-application",
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
    const website = yield* Website;

    return {
      databaseName: database.databaseName,
      websiteUrl: website.url,
    };
  }),
);
