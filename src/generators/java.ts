import { ExampleParams } from "../types";

export function generateJavaExample(
  example: ExampleParams,
  baseUrl: string
): string {
  const { method, path, params } = example;
  const encodedQuery = new URLSearchParams(params.query).toString();
  const fullUrl = `${baseUrl}${path.replace(
    /{(\w+)}/g,
    (_, k) => params.path[k]
  )}${encodedQuery ? `?${encodedQuery}` : ""}`;

  const lines = [
    `HttpURLConnection conn = (HttpURLConnection) new URL("${fullUrl}").openConnection();`,
    `conn.setRequestMethod("${method}");`,
  ];

  if (params.body) {
    lines.push(
      'conn.setRequestProperty("Content-Type", "application/json");',
      "conn.setDoOutput(true);",
      "OutputStream os = conn.getOutputStream();",
      `os.write(${JSON.stringify(JSON.stringify(params.body))}.getBytes());`,
      "os.flush();",
      "os.close();"
    );
  }

  lines.push("int responseCode = conn.getResponseCode();");

  return lines.join("\n");
}

