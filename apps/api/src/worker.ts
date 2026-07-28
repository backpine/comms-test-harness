import { AppRpcs } from "@comms-test-harness/contracts";
import { Database, TestRecords } from "@comms-test-harness/db";
import {
  makeHello,
  type TestRecordRepository,
} from "@comms-test-harness/domain";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import { count } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { RpcSerialization, RpcServer } from "effect/unstable/rpc";

export default class Api extends Cloudflare.Workers.RpcWorker<Api>()(
  "Api",
  {
    main: import.meta.url,
    schema: AppRpcs,
    url: false,
  },
  Effect.gen(function* () {
    const database = yield* Database;
    const d1 = yield* Cloudflare.D1.QueryDatabase(database);
    const db = yield* Drizzle.D1(d1);

    const testRecordRepository: TestRecordRepository = {
      count: db
        .select({ value: count() })
        .from(TestRecords)
        .pipe(
          Effect.map(([row]) => row?.value ?? 0),
          Effect.orDie,
        ),
    };

    const handlers = AppRpcs.toLayer({
      hello: () => makeHello(testRecordRepository),
    });

    return RpcServer.toHttpEffect(AppRpcs).pipe(
      Effect.provide(Layer.mergeAll(handlers, RpcSerialization.layerJson)),
    );
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseBinding)),
) {}
