import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import Vue from "@vitejs/plugin-vue";
import { VueRouterAutoImports } from "unplugin-vue-router";
export default defineConfig({
  plugins: [
    Vue(),
    VueRouter({
      routesFolder: [
        {
          src: "front/src/pages",
          path: "",
        },
      ],
    }),
    AutoImport({
      imports: [VueRouterAutoImports],
      dts: "auto-import.d.ts",
    }),
    Components({
      dirs: ["front/src/components"],
      dts: "auto-components.d.ts",
    }),
  ],
  root: "front",
  server: {
    port: 8080,
  },
});
