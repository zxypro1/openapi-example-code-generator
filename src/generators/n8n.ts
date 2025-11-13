import { ExampleParams, Language } from "../types";

const translations = {
  en: {
    title: "Configure HTTP Request node in n8n workflow:",
    addNode: "Add HTTP Request node",
    configureRequest: "Configure request parameters:",
    method: "Method",
    queryParams: "Configure query parameters:",
    bodyConfig: "Configure request body:",
    bodyContentType: "Body Content Type: JSON",
    bodyParameters: "Body Parameters:",
    execute: "Execute the node and view response results",
  },
  zh: {
    title: "在 n8n 工作流中配置 HTTP Request 节点：",
    addNode: "添加 HTTP Request 节点",
    configureRequest: "配置请求参数：",
    method: "请求方法",
    queryParams: "配置查询参数：",
    bodyConfig: "配置请求体：",
    bodyContentType: "Body Content Type: JSON",
    bodyParameters: "Body Parameters:",
    execute: "执行节点并查看响应结果",
  },
};

export function generateN8nExample(
  example: ExampleParams,
  baseUrl: string,
  language: Language = "en"
): string {
  const { method, path, params } = example;
  const encodedQuery = new URLSearchParams(params.query).toString();
  const fullUrl = `${baseUrl}${path.replace(
    /{(\w+)}/g,
    (_, k) => params.path[k]
  )}${encodedQuery ? `?${encodedQuery}` : ""}`;

  const t = translations[language];
  const lines = [
    t.title,
    "",
    `1. ${t.addNode}`,
    "",
    `2. ${t.configureRequest}`,
    `   - ${t.method}: ${method}`,
    `   - URL: ${fullUrl}`,
  ];

  if (Object.keys(params.query).length > 0) {
    lines.push("");
    lines.push(`3. ${t.queryParams}`);
    Object.entries(params.query).forEach(([key, value]) => {
      lines.push(`   - ${key}: ${value}`);
    });
  }

  if (params.body) {
    lines.push("");
    lines.push(
      `${Object.keys(params.query).length > 0 ? "4" : "3"}. ${t.bodyConfig}`
    );
    lines.push(`   - ${t.bodyContentType}`);
    lines.push(`   - ${t.bodyParameters}`);
    Object.entries(params.body).forEach(([key, value]) => {
      const displayValue =
        typeof value === "object" ? JSON.stringify(value) : value;
      lines.push(`     * ${key}: ${displayValue}`);
    });
  }

  lines.push("");
  lines.push(
    `${
      params.body
        ? Object.keys(params.query).length > 0
          ? "5"
          : "4"
        : Object.keys(params.query).length > 0
        ? "4"
        : "3"
    }. ${t.execute}`
  );

  return lines.join("\n");
}

