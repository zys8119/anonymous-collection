import { controller, routes } from "@wisdom-serve/serve/types/type";
import query from "../mysql";
export const create = async function () {
  const content = await this.$s.get(true, this.$body, "content");
  await query("INSERT INTO tirilaser (content) VALUES (?)", [content]);
  this.$success("更新成功");
} as controller;
export const list = async function () {
  const res = await query("SELECT * FROM tirilaser");
  this.$success({
    list: res,
  });
} as controller;
export default [
  {
    path: "/tirilaser",
    children: [
      {
        path: "create",
        method: "POST",
        controller: create,
      },
      {
        path: "list",
        method: "GET",
        controller: list,
      },
    ],
  },
] as routes;
