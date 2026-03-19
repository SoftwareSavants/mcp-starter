export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}
