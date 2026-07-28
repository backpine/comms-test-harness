import type * as Effect from "effect/Effect";

export interface TestRecordRepository {
  readonly count: Effect.Effect<number>;
}
