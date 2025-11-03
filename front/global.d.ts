import "vue-router";
import "vite";
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}
