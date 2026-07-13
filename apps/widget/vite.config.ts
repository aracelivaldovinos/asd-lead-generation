import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL ?? ""),
  },
  plugins: [react(), tailwindcss(), cssInjectedByJs()],
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "ASDWidget",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
  },
  };
});
