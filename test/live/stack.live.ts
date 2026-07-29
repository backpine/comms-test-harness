import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle";
import * as Test from "alchemy/Test/Bun";
import { describe, expect } from "bun:test";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schedule from "effect/Schedule";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientResponse from "effect/unstable/http/HttpClientResponse";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import { RpcClient, RpcSerialization } from "effect/unstable/rpc";
import Stack from "../../alchemy.run.ts";
import { AppRpcs, PublicApi } from "../../packages/contracts/src/index.ts";

describe.each([true, false])("CommsTestHarness (dev: %p)", (dev) => {
  const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
    providers: Layer.mergeAll(Cloudflare.providers(), Drizzle.providers()),
    state: Alchemy.localState(),
    dev,
  });

  const stack = beforeAll(
    deploy(Stack).pipe(
      Effect.tap(({ apiUrl }) =>
        HttpClient.get(new URL("/health", apiUrl)).pipe(
          Effect.flatMap(HttpClientResponse.filterStatusOk),
          Effect.retry({
            schedule: Schedule.max([
              Schedule.spaced("500 millis"),
              Schedule.recurs(20),
            ]),
          }),
        ),
      ),
    ),
  );

  afterAll.skipIf(!!process.env.NO_DESTROY)(destroy(Stack));

  const rpcProtocol = stack.pipe(
    Effect.map(({ websiteUrl }) =>
      RpcClient.layerProtocolHttp({
        url: new URL("/rpc", websiteUrl).toString(),
      }),
    ),
    Layer.unwrap,
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(RpcSerialization.layerJson),
  );

  test(
    "deploys the public API, website, private RPC backend, and D1",
    Effect.gen(function* () {
      const { apiUrl, databaseName, websiteUrl } = yield* stack;
      expect(apiUrl).toBeString();
      expect(databaseName).toBeString();
      expect(websiteUrl).toBeString();
    }),
  );

  test(
    "serves the schema-first HTTP API",
    Effect.gen(function* () {
      const { apiUrl } = yield* stack;
      const client = yield* HttpApiClient.make(PublicApi, {
        baseUrl: apiUrl,
      });
      const health = yield* client.Health.health();

      expect(health.status).toBe("ok");
      expect(health.service).toBe("comms-test-harness-api");
    }).pipe(Effect.provide(FetchHttpClient.layer)),
  );

  test(
    "round-trips RPC through the TanStack Start server route",
    Effect.gen(function* () {
      const client = yield* RpcClient.make(AppRpcs);
      const response = yield* client.hello();

      expect(response.message).toBe("Hello from Effect RPC");
      expect(response.database).toBe("d1");
      expect(response.testRecordCount).toBeNumber();
    }).pipe(Effect.provide(rpcProtocol)),
  );
});
