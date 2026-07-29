# Architecture

The initial system has three Worker surfaces and one cloud data resource:

```text
Browser
  -> TanStack Start website Worker
       -> /rpc server route
            -> private service binding
                 -> Effect RPC Worker
                      -> Drizzle -> D1

HTTP client
  -> Effect HttpApi Worker
       -> Drizzle -> D1
```

- `apps/web` is a TanStack Start application. Its generated server Worker owns
  SSR and the same-origin `/rpc` file route; there is no hand-written asset
  proxy Worker.
- `apps/api/src/backend.ts` is an ordinary private `Cloudflare.Worker` whose
  Init phase returns the `HttpEffect` produced by `RpcServer.toHttpEffect`.
  The website reaches it only through the typed `BACKEND` service binding.
- `apps/api/src/worker.ts` is the public `Cloudflare.Worker`. It implements the
  shared Effect `HttpApi` description and is the future home of agent and
  provider HTTP endpoints.
- `packages/contracts` owns schemas, HTTP API descriptions, and RPC contracts
  shared across deployment boundaries.
- `packages/domain` owns business programs and repository ports without
  Cloudflare dependencies.
- `packages/db` owns the Drizzle schema, committed migrations, and Alchemy D1
  resource definition.

Alchemy provisions D1, applies migrations, builds all Worker surfaces, uploads
the TanStack Start assets, and wires the private binding. Referencing the RPC
backend from `Website.env` adds it to the resource graph automatically; it does
not need a public URL or a second manual deployment step. R2 and queues are
intentionally absent.

This mirrors Alchemy V2's `cloudflare-tanstack-rpc-drizzle` example and Effect
HTTP API guide: framework server routes handle web concerns, while Worker Init
constructs typed Effect handlers once and returns a `fetch` `HttpEffect`.
