import { controller, routes } from "@wisdom-serve/serve/types/type";
import query from "../mysql";
import * as XLSX from "xlsx";
export const create = async function () {
  const content = await this.$s.get(true, this.$body, "content");
  const name = await this.$s.get(this.$body, "name", "匿名");
  await query("INSERT INTO tirilaser (content, name) VALUES (?)", [
    content,
    name,
  ]);
  this.$success("更新成功");
} as controller;
const Authenticate = async function (request) {
  // 简单账号密码
  const USERNAME = "admin";
  const PASSWORD = "123456";

  // 将账号密码转换为 Base64（Basic Auth 格式）
  const authHeader =
    "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");
  // 检查请求头中的 Authorization 是否匹配
  if (request.headers.authorization !== authHeader) {
    this.$error("未授权", {
      statusCode: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted Area"',
      },
    });
    return true;
  }
  return false;
} as controller;
export const list = async function (request) {
  if (await (Authenticate as any).call(this, request)) {
    return;
  }
  const res = await query("SELECT * FROM tirilaser");
  this.$success({
    list: res,
  });
} as controller;
export const exportData = async function (request) {
  if (await (Authenticate as any).call(this, request)) {
    return;
  }
  const data = await query(
    "SELECT name as 姓名, content as 吐槽内容 FROM tirilaser"
  );
  // 1️⃣ 将 JSON 转换为工作表
  const worksheet = XLSX.utils.json_to_sheet(data as any);

  // 2️⃣ 创建一个新的工作簿
  const workbook = XLSX.utils.book_new();

  // 3️⃣ 把工作表加入工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
  // 4️⃣ 写入 Excel 文件
  this.$send(buffer, {
    headers: {
      "access-control-allow-origin": request.headers.origin || "*",
      "access-control-allow-methods": "*",
      "access-control-allow-headers": this.options.corsHeaders || "*",
    },
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
      {
        path: "export",
        method: "GET",
        controller: exportData,
      },
    ],
  },
] as routes;
