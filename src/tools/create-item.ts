import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  name: z.string().describe("Item name"),
  description: z.string().optional().describe("Item description"),
};

interface CreatedItem {
  id: string;
  name: string;
}

export const name = "create_item";
export const description = "Create a new item. Returns the created item's id and name.";

export async function handler(
  args: { name: string; description?: string },
  config: ApiConfig,
) {
  const item = await apiRequest<CreatedItem>(config, "/items", {
    method: "POST",
    body: JSON.stringify({ name: args.name, description: args.description ?? "" }),
  });

  return {
    content: [{ type: "text" as const, text: `Created item "${item.name}" (ID: ${item.id})` }],
  };
}
