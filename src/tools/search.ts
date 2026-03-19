import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  query: z.string().describe("Search query"),
  limit: z.number().optional().describe("Max results (default 5)"),
};

interface Product {
  id: number;
  title: string;
  price: number;
}

export const name = "search";
export const description = "Search products by query. Returns matching id, title, and price.";

export async function handler(
  args: { query: string; limit?: number },
  config: ApiConfig,
) {
  const searchParams = new URLSearchParams({
    q: args.query,
    limit: String(args.limit ?? 5),
  });

  const data = await apiRequest<{ products: Product[] }>(
    config,
    `/products/search?${searchParams.toString()}`,
  );

  if (data.products.length === 0) {
    return { content: [{ type: "text" as const, text: "No results found." }] };
  }

  const results = data.products.map((p) => ({ id: p.id, title: p.title, price: p.price }));
  return { content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }] };
}
