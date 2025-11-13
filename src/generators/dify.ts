import { ExampleParams, Language } from "../types";

const translations = {
  en: {
    step1: "Add custom tool in Dify application",
    toolName: "Tool Name",
    apiCall: "API Call",
    apiEndpoint: "API Endpoint",
    requestMethod: "Request Method",
    authentication: "Authentication",
    bearerToken: "Bearer Token",
    parameters: "Parameter Configuration:",
    step2: "Invoke this tool node in the conversation flow",
  },
  zh: {
    step1: "在 Dify 应用中添加自定义工具",
    toolName: "工具名称",
    apiCall: "API 调用",
    apiEndpoint: "API端点",
    requestMethod: "请求方法",
    authentication: "认证方式",
    bearerToken: "Bearer Token",
    parameters: "参数配置:",
    step2: "在对话流程中调用该工具节点",
  },
};

export function generateDifyExample(
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
    `1. ${t.step1}`,
    "",
    `${t.toolName}: ${t.apiCall}`,
    `${t.apiEndpoint}: ${fullUrl}`,
    `${t.requestMethod}: ${method}`,
    `${t.authentication}: ${t.bearerToken}`,
  ];

  const allParams: string[] = [];

  // Add query parameters
  if (Object.keys(params.query).length > 0) {
    Object.entries(params.query).forEach(([key, value]) => {
      const type =
        typeof value === "number"
          ? "number"
          : typeof value === "boolean"
          ? "boolean"
          : "string";
      allParams.push(`  - ${key} (${type}): ${value}`);
    });
  }

  // Add request body parameters
  if (params.body && typeof params.body === "object") {
    Object.entries(params.body).forEach(([key, value]) => {
      const type =
        typeof value === "number"
          ? "number"
          : typeof value === "boolean"
          ? "boolean"
          : typeof value === "object"
          ? "object"
          : "string";
      const displayValue =
        typeof value === "object" ? JSON.stringify(value) : value;
      allParams.push(`  - ${key} (${type}): ${displayValue}`);
    });
  }

  if (allParams.length > 0) {
    lines.push(t.parameters);
    lines.push(...allParams);
  }

  lines.push("");
  lines.push(`2. ${t.step2}`);

  return lines.join("\n");
}

