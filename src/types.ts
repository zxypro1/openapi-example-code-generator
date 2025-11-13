export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options";

export type Language = "en" | "zh";

export type ExampleParams = {
  method: string;
  path: string;
  params: {
    path: Record<string, any>;
    query: Record<string, any>;
    body?: any;
  };
};

