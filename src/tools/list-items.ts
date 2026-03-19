import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

// Schema is the single source of truth — defines both validation and types
export const params = {
  status: z.enum(["active", "archived"]).optional().describe("Filter by status"),
  limit: z.number().optional().describe("Max results (default 10, max 50)"),
};

interface Item {
  id: string;
  name: string;
  status: string;
}

export const name = "list_items";
// Keep descriptions SHORT — every character costs tokens on every request
export const description = "List items. Optional status filter. Returns id, name, status.";

export async function handler(
  args: { status?: "active" | "archived"; limit?: number },
  config: ApiConfig,
) {
  const searchParams = new URLSearchParams();
  if (args.status) searchParams.set("status", args.status);
  searchParams.set("limit", String(args.limit ?? 10));

  const data = await apiRequest<{ items: Item[] }>(
    config,
    `/items?${searchParams.toString()}`,
  );

  // Return ONLY what the agent needs — lean response
  const items = data.items.map((i) => ({
    id: i.id,
    name: i.name,
    status: i.status,
  }));

  return { content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }] };
}
