import { HealthResponse, PublicApi } from "@comms-test-harness/contracts";
import { makeHello } from "@comms-test-harness/domain";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Etag from "effect/unstable/http/Etag";
import * as HttpPlatform from "effect/unstable/http/HttpPlatform";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder";
import { TestRecordRepositoryLive } from "./repositories/test-record-repository.ts";

const HttpPlatformStub = Layer.succeed(HttpPlatform.HttpPlatform, {
  fileResponse: () => Effect.die("HttpPlatform.fileResponse is not supported"),
  fileWebResponse: () =>
    Effect.die("HttpPlatform.fileWebResponse is not supported"),
});

export default class Api extends Cloudflare.Worker<Api>()(
  "Api",
  { main: import.meta.url },
  Effect.gen(function* () {
    const testRecords = yield* TestRecordRepositoryLive;

    const healthGroup = HttpApiBuilder.group(PublicApi, "Health", (handlers) =>
      handlers.handle("health", () =>
        Effect.succeed(
          new HealthResponse({
            status: "ok",
            service: "comms-test-harness-api",
          }),
        ),
      ),
    );

    const systemGroup = HttpApiBuilder.group(PublicApi, "System", (handlers) =>
      handlers.handle("systemInfo", () => makeHello(testRecords)),
    );

    return {
      fetch: yield* HttpRouter.toHttpEffect(
        HttpApiBuilder.layer(PublicApi).pipe(
          Layer.provide([healthGroup, systemGroup]),
          Layer.provide([Etag.layer, HttpPlatformStub, Path.layer]),
        ),
      ),
    };
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseBinding)),
) {}
