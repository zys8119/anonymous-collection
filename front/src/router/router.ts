import { createRouter, createWebHashHistory } from "vue-router";
import { routes, handleHotUpdate } from "vue-router/auto-routes";
export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "匿名收藏";
  next();
});
// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router);
}
