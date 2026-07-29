import * as Schema from "effect/Schema";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import { HelloResponse } from "./rpc.ts";

export class HealthResponse extends Schema.Class<HealthResponse>(
  "HealthResponse",
)({
  status: Schema.Literal("ok"),
  service: Schema.Literal("comms-test-harness-api"),
}) {}

const health = HttpApiEndpoint.get("health", "/health", {
  success: HealthResponse,
});

const systemInfo = HttpApiEndpoint.get("systemInfo", "/v1/system", {
  success: HelloResponse,
});

export class HealthGroup extends HttpApiGroup.make("Health").add(health) {}

export class SystemGroup extends HttpApiGroup.make("System").add(systemInfo) {}

export class PublicApi extends HttpApi.make("PublicApi")
  .add(HealthGroup)
  .add(SystemGroup) {}
