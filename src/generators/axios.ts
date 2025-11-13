import { ExampleParams } from "../types";

export function generateAxiosExample(
  example: ExampleParams,
  baseUrl: string
): string {
  const { method, path, params } = example;
  const basePath = path.replace(/{(\w+)}/g, (_, k) => params.path[k]);
  const fullUrl = `${baseUrl}${basePath}`;

  const lines = [
    "import axios from 'axios';",
    "",
    `axios.${method.toLowerCase()}(\`${fullUrl}\`,`,
  ];

  const config = [];

  if (Object.keys(params.query).length) {
    config.push(`  params: ${JSON.stringify(params.query, null, 2)}`);
  }

  if (params.body) {
    config.push(`  data: ${JSON.stringify(params.body, null, 2)}`);
  }

  if (config.length > 0) {
    lines.push("  {");
    lines.push(config.join(",\n"));
    lines.push("  }");
  }

  lines.push(")");
  lines.push(".then(response => console.log(response.data))");
  lines.push(".catch(error => console.error('Error:', error));");

  return lines.join("\n");
}

