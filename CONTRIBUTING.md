# Contributing

Thanks for helping build Comms Test Harness.

1. Install the Bun version pinned in `package.json`.
2. Create a branch and keep changes focused.
3. Run `bun run check` before opening a pull request.
4. If the Drizzle schema changes, run `bun run db:generate` and commit the
   generated SQL and snapshot.
5. Review `bun alchemy plan --stage dev-your-name` before deploying a personal
   stage. Never target another contributor's stage.

Alchemy, Effect 4, Atom React, and Drizzle are a compatibility cohort in this
repository. Upgrade them together in a dedicated pull request and include a
live isolated-stage smoke test.
