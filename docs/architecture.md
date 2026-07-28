# Architecture

The initial system has three deployable concerns and one cloud data resource:

```text
Browser
  -> Vite React Worker
       -> /rpc private service binding
            -> Effect RPC Worker
                 -> Drizzle
                      -> D1
```

- `apps/web` owns the React application, TanStack Router, Atom RPC client, and
  the thin same-origin `/rpc` proxy.
- `apps/api` owns provider adapters and runtime composition. Its Worker has no
  public `workers.dev` URL; the website reaches it through a service binding.
- `packages/contracts` owns schemas and RPC descriptions shared across the
  browser/server boundary.
- `packages/domain` owns business programs and repository ports without
  Cloudflare dependencies.
- `packages/db` owns the Drizzle schema, committed migrations, and Alchemy D1
  resource definition.

Alchemy provisions the D1 database, applies migrations, builds both Worker
bundles, uploads the Vite assets, and wires the private binding. R2 and queues
are intentionally absent. They can be introduced later only if a measured
requirement justifies them.
