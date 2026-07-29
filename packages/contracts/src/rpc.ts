import * as Schema from "effect/Schema";
import { Rpc, RpcGroup } from "effect/unstable/rpc";

export class HelloResponse extends Schema.Class<HelloResponse>("HelloResponse")({
  message: Schema.String,
  service: Schema.Literal("comms-test-harness-api"),
  database: Schema.Literal("d1"),
  testRecordCount: Schema.Number,
}) {}

export class AppRpcs extends RpcGroup.make(
  Rpc.make("hello", {
    success: HelloResponse,
  }),
) {}
