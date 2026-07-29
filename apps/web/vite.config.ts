import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
  build: {
    rolldownOptions: {
      // Alchemy resolves this runtime module when deploying; preserve it in
      // credential-free `vite build` runs used by contributors and CI.
      external: ["cloudflare:workers"],
    },
  },
});
