import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig( {
  plugins: [ react(), tailwindcss() ],
  base: "./",
  server: {
    host: true,
    port: 8081,
    strictPort: true,

    // Cloud Shell web preview domain
    allowedHosts: [ ".cloudshell.dev" ],

    // HMR over the proxy
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  },
} );
