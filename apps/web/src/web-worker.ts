import type { WebsiteEnv } from "../../../alchemy.run.ts";

export default {
  fetch(request: Request, env: WebsiteEnv): Promise<Response> {
    const path = new URL(request.url).pathname;

    if (path === "/rpc" || path.startsWith("/rpc/")) {
      return env.BACKEND.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
