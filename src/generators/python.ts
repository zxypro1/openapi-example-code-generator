import { ExampleParams } from "../types";

export function generatePythonExample(
  example: ExampleParams,
  baseUrl: string
): string {
  const { method, path, params } = example;
  const basePath = path.replace(/{(\w+)}/g, (_, k) => params.path[k]);

  const lines = [
    "import requests",
    "",
    `response = requests.${method.toLowerCase()}("${baseUrl}${basePath}"`,
  ];

  if (Object.keys(params.query).length) {
    lines.push(`    params=${JSON.stringify(params.query)},`);
  }

  if (params.body) {
    lines.push(`    json=${JSON.stringify(params.body)}`);
  }

  lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, "");
  lines.push(")");

  return lines.join("\n");
}

