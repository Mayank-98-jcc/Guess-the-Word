import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    outDir: "build",
    target: "es2019",
    minify: "esbuild",
    cssMinify: true,
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("react")) {
            return "react-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
