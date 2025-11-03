import { createRouter, createWebHashHistory } from "vue-router";
import { routes, handleHotUpdate } from "vue-router/auto-routes";
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
console.log(routes);
// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router);
}
