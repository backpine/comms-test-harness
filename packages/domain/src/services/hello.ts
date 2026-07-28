import { HelloResponse } from "@comms-test-harness/contracts";
import * as Effect from "effect/Effect";
import type { TestRecordRepository } from "../ports/test-record-repository.ts";

export const makeHello = (repository: TestRecordRepository) =>
  repository.count.pipe(
    Effect.map(
      (testRecordCount) =>
        new HelloResponse({
          message: "Hello from Effect RPC",
          service: "comms-test-harness-api",
          database: "d1",
          testRecordCount,
        }),
    ),
  );
