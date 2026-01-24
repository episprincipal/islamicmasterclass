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

    // HMR configuration - uses ws for local, wss for Cloud Shell
    hmr: process.env.CLOUDSHELL_ENVIRONMENT ? {
      protocol: "wss",
      clientPort: 443,
    } : true,

    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
} );
