import { createRoute } from "@wisdom-serve/serve";
import tirilaser from "./controller/tirilaser";
export default createRoute({
  routes: [].concat(tirilaser),
});
