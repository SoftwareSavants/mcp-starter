import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  query: z.string().describe("Search query"),
  limit: z.number().optional().describe("Max results (default 5)"),
};

interface SearchResult {
  id: string;
  name: string;
  score: number;
}

export const name = "search";
export const description = "Search items by query. Returns matching id, name, and relevance.";

export async function handler(
  args: { query: string; limit?: number },
  config: ApiConfig,
) {
  const searchParams = new URLSearchParams({
    q: args.query,
    limit: String(args.limit ?? 5),
  });

  const data = await apiRequest<{ results: SearchResult[] }>(
    config,
    `/search?${searchParams.toString()}`,
  );

  if (data.results.length === 0) {
    return { content: [{ type: "text" as const, text: "No results found." }] };
  }

  const results = data.results.map((r) => ({ id: r.id, name: r.name }));
  return { content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }] };
}
