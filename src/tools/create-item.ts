import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  title: z.string().describe("Product title"),
  description: z.string().optional().describe("Product description"),
  price: z.number().optional().describe("Product price"),
};

interface CreatedProduct {
  id: number;
  title: string;
}

export const name = "create_item";
export const description = "Create a new product. Returns the created product's id and title.";

export async function handler(
  args: { title: string; description?: string; price?: number },
  config: ApiConfig,
) {
  const item = await apiRequest<CreatedProduct>(config, "/products/add", {
    method: "POST",
    body: JSON.stringify({ title: args.title, description: args.description ?? "", price: args.price ?? 0 }),
  });

  return {
    content: [{ type: "text" as const, text: `Created product "${item.title}" (ID: ${item.id})` }],
  };
}
