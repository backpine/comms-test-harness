# Comms Test Harness

An open-source, Cloudflare-native foundation for testing email and SMS
integrations. The current milestone is the working platform blueprint: Alchemy
provisions D1 and two Workers, Effect owns the API/RPC runtime, and a React app
calls a typed hello RPC on its homepage.

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
page calls Effect RPC through the website's private service binding and shows
the row count from `test_records`.

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

After changing `packages/db/src/schema.ts`, generate and review the next
committed migration with:

```bash
bun run db:generate
```

## Repository layout

```text
apps/api             Effect RPC Cloudflare Worker
apps/web             React, TanStack Router, Atom RPC, and RPC proxy
packages/contracts   Shared Effect schemas and RPC contracts
packages/domain      Business services and repository ports
packages/db          Drizzle schema, migrations, and Alchemy D1 resource
docs                 Architecture, versions, and product design
alchemy.run.ts        Complete cloud resource graph
```

See [the architecture](./docs/architecture.md) and [the design](./designs/standalone-communications-testing-service.md).

## License

Apache-2.0
