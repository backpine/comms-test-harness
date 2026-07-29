import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/rpc")({
  server: {
    handlers: {
      ANY: async ({ request }) => await env.BACKEND.fetch(request),
    },
  },
});
