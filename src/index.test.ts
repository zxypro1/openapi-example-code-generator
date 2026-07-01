import { OpenAPIV3 } from "openapi-types";
import { OpenAPICodeGenerator } from "./index";

const xquikSearchSpec: OpenAPIV3.Document = {
  openapi: "3.1.0",
  info: {
    title: "Xquik API",
    version: "1.0",
  },
  servers: [{ url: "https://xquik.com" }],
  paths: {
    "/api/v1/x/tweets/search": {
      get: {
        operationId: "searchTweets",
        parameters: [
          {
            name: "query",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "from:openapi",
            },
          },
        ],
        responses: {
          "200": {
            description: "Search results",
          },
        },
      },
    },
  },
};

describe("OpenAPICodeGenerator", () => {
  it("generates encoded query examples from the Xquik search operation", () => {
    const generator = new OpenAPICodeGenerator(xquikSearchSpec);

    expect(generator.getCurlExamples()).toEqual([
      "curl -X GET 'https://xquik.com/api/v1/x/tweets/search?query=from%3Aopenapi'",
    ]);
    expect(generator.getJavaScriptExamples()[0]).toContain(
      "https://xquik.com/api/v1/x/tweets/search?query=from%3Aopenapi"
    );
    expect(generator.getN8nExamples()[0]).toContain(
      "URL: https://xquik.com/api/v1/x/tweets/search?query=from%3Aopenapi"
    );
  });
});
