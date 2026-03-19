import type { ApiConfig, ToolResponse } from "../types.js";
import { apiRequest } from "../auth.js";

export const definition = {
  name: "search",
  description: "Search items by query. Returns matching id, name, and relevance.",
  inputSchema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Search query",
      },
      limit: {
        type: "number",
        description: "Max results (default 5)",
      },
    },
    required: ["query"],
  },
};

interface SearchResult {
  id: string;
  name: string;
  score: number;
}

export async function handler(
  args: Record<string, unknown>,
  config: ApiConfig,
): Promise<ToolResponse> {
  const params = new URLSearchParams({
    q: String(args.query),
    limit: String(args.limit ?? 5),
  });

  const data = await apiRequest<{ results: SearchResult[] }>(
    config,
    `/search?${params.toString()}`,
  );

  if (data.results.length === 0) {
    return {
      content: [{ type: "text", text: "No results found." }],
    };
  }

  const results = data.results.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
}
