import { OpenAPIV3 } from "openapi-types";
import { HttpMethod, ExampleParams } from "./types";
import {
  generateCurlExample,
  generatePythonExample,
  generateJavaExample,
  generateJavaScriptExample,
  generateAxiosExample,
  generateN8nExample,
  generateDifyExample,
} from "./generators";

class OpenAPICodeGenerator {
  private openApi: OpenAPIV3.Document;
  private baseUrl: string;

  constructor(openApi: OpenAPIV3.Document, serverUrl?: string) {
    this.openApi = openApi;
    this.baseUrl = serverUrl || this.getDefaultServerUrl();
  }

  private getDefaultServerUrl(): string {
    return this.openApi.servers?.[0]?.url || "http://localhost";
  }

  private resolveSchemaExample(schema?: OpenAPIV3.SchemaObject): any {
    if (!schema) return "unknown";
    if (schema.example !== undefined) return schema.example;

    switch (schema.type) {
      case "string":
        return schema.format === "uuid"
          ? "00000000-0000-0000-0000-000000000000"
          : "string";
      case "number":
      case "integer":
        return 0;
      case "boolean":
        return true;
      case "object":
        return Object.entries(schema.properties || {}).reduce(
          (acc, [key, val]) => {
            acc[key] = this.resolveSchemaExample(
              val as OpenAPIV3.SchemaObject
            );
            return acc;
          },
          {} as Record<string, any>
        );
      case "array":
        return schema.items
          ? [
              this.resolveSchemaExample(
                schema.items as OpenAPIV3.SchemaObject
              ),
            ]
          : [];
      default:
        return "unknown";
    }
  }

  private collectExamples(): ExampleParams[] {
    const examples: ExampleParams[] = [];

    for (const [path, pathItem] of Object.entries(this.openApi.paths || {})) {
      if (!pathItem) continue;

      for (const method of Object.keys(pathItem).filter((k) =>
        ["get", "post", "put", "delete", "patch", "head", "options"].includes(
          k
        )
      ) as HttpMethod[]) {
        const operation = pathItem[method] as OpenAPIV3.OperationObject;
        if (!operation || !["get", "post", "put", "delete"].includes(method))
          continue;

        const params = {
          path: {} as Record<string, any>,
          query: {} as Record<string, any>,
          body: null as any,
        };

        operation.parameters?.forEach((param) => {
          const parameter = param as OpenAPIV3.ParameterObject;
          const example = this.resolveSchemaExample(
            parameter.schema as OpenAPIV3.SchemaObject
          );
          if (parameter.in === "path") params.path[parameter.name] = example;
          if (parameter.in === "query") params.query[parameter.name] = example;
        });

        const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;
        if (requestBody?.content?.["application/json"]) {
          const mediaType = requestBody.content[
            "application/json"
          ] as OpenAPIV3.MediaTypeObject;
          params.body = this.resolveSchemaExample(
            mediaType.schema as OpenAPIV3.SchemaObject
          );
        }

        examples.push({
          method: method.toUpperCase(),
          path,
          params,
        });
      }
    }

    return examples;
  }

  public getCurlExamples(): string[] {
    return this.collectExamples().map((example) =>
      generateCurlExample(example, this.baseUrl)
    );
  }

  public getPythonExamples(): string[] {
    return this.collectExamples().map((example) =>
      generatePythonExample(example, this.baseUrl)
    );
  }

  public getJavaExamples(): string[] {
    return this.collectExamples().map((example) =>
      generateJavaExample(example, this.baseUrl)
    );
  }

  public getJavaScriptExamples(): string[] {
    return this.collectExamples().map((example) =>
      generateJavaScriptExample(example, this.baseUrl)
    );
  }

  public getAxiosExamples(): string[] {
    return this.collectExamples().map((example) =>
      generateAxiosExample(example, this.baseUrl)
    );
  }

  public getN8nExamples(language: "en" | "zh" = "en"): string[] {
    return this.collectExamples().map((example) =>
      generateN8nExample(example, this.baseUrl, language)
    );
  }

  public getDifyExamples(language: "en" | "zh" = "en"): string[] {
    return this.collectExamples().map((example) =>
      generateDifyExample(example, this.baseUrl, language)
    );
  }

  public getAllExamples(language: "en" | "zh" = "en"): string[] {
    return [
      ...this.getCurlExamples(),
      ...this.getPythonExamples(),
      ...this.getJavaExamples(),
      ...this.getJavaScriptExamples(),
      ...this.getAxiosExamples(),
      ...this.getN8nExamples(language),
      ...this.getDifyExamples(language),
    ];
  }
}

export { OpenAPICodeGenerator };
