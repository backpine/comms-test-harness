import { describe, expect, it } from "vitest";
import * as Effect from "effect/Effect";
import { makeHello } from "../src/services/hello.ts";

describe("makeHello", () => {
  it("reports the D1 test record count", async () => {
    const response = await Effect.runPromise(
      makeHello({ count: Effect.succeed(3) }),
    );

    expect(response.message).toBe("Hello from Effect RPC");
    expect(response.database).toBe("d1");
    expect(response.testRecordCount).toBe(3);
  });
});
