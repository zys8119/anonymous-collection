import { Plugin } from "@wisdom-serve/serve/types/type";
import { Serialize } from "data-preprocessor";
export default (async function () {
  this.$serialize = Serialize;
  this.$s = Serialize;
} as Plugin);
declare module "@wisdom-serve/serve" {
  interface AppServeInterface {
    $serialize: typeof Serialize;
    $s: typeof Serialize;
  }
}
