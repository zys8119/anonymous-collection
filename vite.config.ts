import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import VueRouter from "unplugin-vue-router/vite";
import Vue from "@vitejs/plugin-vue";
import { VueRouterAutoImports } from "unplugin-vue-router";
import Unocss from "unocss/vite";
import MotionResolver from "motion-v/resolver";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
    Unocss(),
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
      imports: ["vue", "@vueuse/core", "vue-router", VueRouterAutoImports],
      dts: "auto-import.d.ts",
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
    }),
    Components({
      dirs: ["components"],
      dts: "auto-components.d.ts",
      // include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [MotionResolver(), NaiveUiResolver()],
    }),
  ],
  root: "front",
  server: {},
});
