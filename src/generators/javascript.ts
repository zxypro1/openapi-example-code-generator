import { ExampleParams } from "../types";

export function generateJavaScriptExample(
  example: ExampleParams,
  baseUrl: string
): string {
  const { method, path, params } = example;
  const encodedQuery = new URLSearchParams(params.query).toString();
  const fullUrl = `${baseUrl}${path.replace(
    /{(\w+)}/g,
    (_, k) => params.path[k]
  )}${encodedQuery ? `?${encodedQuery}` : ""}`;

  const lines = [`fetch('${fullUrl}', {`];

  const options = [`  method: '${method}'`];

  if (params.body) {
    options.push(
      "  headers: {",
      '    "Content-Type": "application/json"',
      "  },",
      `  body: JSON.stringify(${JSON.stringify(params.body)})`
    );
  }

  lines.push(...options, "})");
  lines.push(".then(response => response.json())");
  lines.push(".then(data => console.log(data))");
  lines.push('.catch(error => console.error("Error:", error));');

  return lines.join("\n");
}

