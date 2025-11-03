import { createApp } from "vue";
import "./src/assaet/style.css";
import "virtual:uno.css";
import App from "./App.vue";
import { router } from "./src/router/router";

const app = createApp(App);
app.use(router);
app.mount("#app");
console.log(import.meta.env);
