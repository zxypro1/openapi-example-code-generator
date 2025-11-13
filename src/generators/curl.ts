import { ExampleParams } from "../types";

export function generateCurlExample(
  example: ExampleParams,
  baseUrl: string
): string {
  const { method, path, params } = example;
  const encodedQuery = new URLSearchParams(params.query).toString();
  const fullUrl = `${baseUrl}${path.replace(
    /{(\w+)}/g,
    (_, k) => params.path[k]
  )}${encodedQuery ? `?${encodedQuery}` : ""}`;

  return [
    `curl -X ${method}`,
    ...(params.body
      ? [
          '-H "Content-Type: application/json"',
          `-d '${JSON.stringify(params.body)}'`,
        ]
      : []),
    `'${fullUrl}'`,
  ].join(" ");
}

