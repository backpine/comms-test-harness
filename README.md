# Comms Test Harness

An open-source, Cloudflare-native foundation for testing email and SMS
integrations. The current milestone is a working Alchemy V2 blueprint: Alchemy
provisions D1, a TanStack Start website, a private Effect RPC backend, and a
public schema-first Effect HTTP API. The homepage calls a typed hello RPC on
load.

The project is intentionally small: D1 is its only application storage service,
outbound email will use Cloudflare's structured transactional API, and Twilio
webhooks will not carry signature-verification machinery.

## Prerequisites

- A Cloudflare account with Workers and D1 enabled
- [Bun 1.3.14](https://bun.sh/)
- Cloudflare credentials available through Alchemy's interactive login or the
  `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` environment variables

## Run it

```bash
bun install
bun alchemy dev
```

Alchemy runs the application locally while using a real, stage-isolated D1
database in your Cloudflare account. Open the printed `websiteUrl`; the home
page calls Effect RPC through TanStack Start's `/rpc` server route and a private
service binding. The result includes the row count from `test_records`.

The printed `apiUrl` exposes the starter HTTP API:

```text
GET /health
GET /v1/system
```

Both routes come from a shared Effect `HttpApi` contract, so handlers and typed
clients are checked against the same request and response schemas.

## Provision a stage

```bash
bun alchemy plan --stage dev-your-name
bun alchemy deploy --stage dev-your-name
```

Use a unique stage name for development. `staging` and `prod` are reserved for
shared environments.

## Project checks

```bash
bun run check
```

This runs strict TypeScript, unit tests, and the Vite client/Worker build.

With Cloudflare credentials configured, exercise a temporary real deployment
in both Alchemy dev and deploy modes:

```bash
bun run test:live
```

Set `NO_DESTROY=1` only when intentionally preserving the test stage for
inspection.

After changing `packages/db/src/schema.ts`, generate and review the next
committed migration with:

```bash
bun run db:generate
```

## Repository layout

```text
apps/api             Public Effect HttpApi Worker and private RPC Worker
apps/web             TanStack Start, React, TanStack Router, and Atom RPC
packages/contracts   Shared HTTP API schemas and RPC contracts
packages/domain      Business services and repository ports
packages/db          Drizzle schema, migrations, and Alchemy D1 resource
docs                 Architecture, versions, and product design
alchemy.run.ts        Complete cloud resource graph
```

See [the architecture](./docs/architecture.md) and
[the design](./designs/standalone-communications-testing-service.md).

## License

Apache-2.0
