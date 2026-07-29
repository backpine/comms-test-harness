import { AppRpcs } from "@comms-test-harness/contracts";
import { makeHello } from "@comms-test-harness/domain";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { RpcSerialization, RpcServer } from "effect/unstable/rpc";
import { TestRecordRepositoryLive } from "./repositories/test-record-repository.ts";

export default Cloudflare.Worker(
  "Backend",
  {
    main: import.meta.url,
    url: false,
  },
  Effect.gen(function* () {
    const testRecords = yield* TestRecordRepositoryLive;
    const handlersLayer = AppRpcs.toLayer({
      hello: () => makeHello(testRecords),
    });

    return {
      fetch: RpcServer.toHttpEffect(AppRpcs).pipe(
        Effect.provide(
          Layer.mergeAll(handlersLayer, RpcSerialization.layerNdjson),
        ),
      ),
    };
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseBinding)),
);
