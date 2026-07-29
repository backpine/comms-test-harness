import { Database, TestRecords } from "@comms-test-harness/db";
import type { TestRecordRepository } from "@comms-test-harness/domain";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import { count } from "drizzle-orm";
import * as Effect from "effect/Effect";

export const TestRecordRepositoryLive = Effect.gen(function* () {
  const database = yield* Database;
  const d1 = yield* Cloudflare.D1.QueryDatabase(database);
  const db = yield* Drizzle.D1(d1);

  const repository: TestRecordRepository = {
    count: db
      .select({ value: count() })
      .from(TestRecords)
      .pipe(
        Effect.map(([row]) => row?.value ?? 0),
        Effect.orDie,
      ),
  };

  return repository;
});
