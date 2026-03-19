import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

// Schema is the single source of truth — defines both validation and types
export const params = {
  category: z.string().optional().describe("Filter by category (e.g. smartphones, laptops)"),
  limit: z.number().optional().describe("Max results (default 10, max 50)"),
};

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
}

export const name = "list_items";
// Keep descriptions SHORT — every character costs tokens on every request
export const description = "List products. Optional category filter. Returns id, title, category, price.";

export async function handler(
  args: { category?: string; limit?: number },
  config: ApiConfig,
) {
  const limit = args.limit ?? 10;

  // DummyJSON: /products or /products/category/{category}
  const path = args.category
    ? `/products/category/${encodeURIComponent(args.category)}?limit=${limit}`
    : `/products?limit=${limit}`;

  const data = await apiRequest<{ products: Product[] }>(config, path);

  // Return ONLY what the agent needs — lean response
  const items = data.products.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
  }));

  return { content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }] };
}
