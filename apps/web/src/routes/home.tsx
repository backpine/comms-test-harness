import { useAtomValue } from "@effect/atom-react";
import * as AsyncResult from "effect/unstable/reactivity/AsyncResult";
import { helloAtom } from "../rpc-client.ts";

export function Home() {
  const result = useAtomValue(helloAtom);
  const hello = AsyncResult.getOrElse(result, () => undefined);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Open-source communications testing</p>
        <h1>Comms Test Harness</h1>
        <p className="lede">
          A Cloudflare-native foundation for receiving, inspecting, and replying
          to test email and SMS conversations.
        </p>
      </section>

      <section className="status-card" aria-live="polite">
        <div>
          <span className="status-dot" aria-hidden="true" />
          <span className="status-label">Effect RPC</span>
        </div>
        {AsyncResult.isFailure(result) ? (
          <p className="error">The API did not respond. Check the local Alchemy process.</p>
        ) : hello === undefined ? (
          <p>Connecting to the API…</p>
        ) : (
          <div className="response">
            <strong>{hello.message}</strong>
            <span>
              D1 is ready. Test records: {hello.testRecordCount}
            </span>
          </div>
        )}
      </section>
    </main>
  );
}
