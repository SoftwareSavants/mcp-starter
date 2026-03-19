import type { ApiConfig, ToolResponse } from "../types.js";
import { apiRequest } from "../auth.js";

export const definition = {
  name: "list_items",
  // Keep descriptions SHORT — every character costs tokens on every request
  description: "List items. Optional status filter. Returns id, name, status.",
  inputSchema: {
    type: "object" as const,
    properties: {
      status: {
        type: "string",
        enum: ["active", "archived"],
        description: "Filter by status",
      },
      limit: {
        type: "number",
        description: "Max results (default 10, max 50)",
      },
    },
  },
};

interface Item {
  id: string;
  name: string;
  status: string;
}

export async function handler(
  args: Record<string, unknown>,
  config: ApiConfig,
): Promise<ToolResponse> {
  const params = new URLSearchParams();
  if (args.status) params.set("status", String(args.status));
  params.set("limit", String(args.limit ?? 10));

  const data = await apiRequest<{ items: Item[] }>(
    config,
    `/items?${params.toString()}`,
  );

  // Return ONLY what the agent needs — lean response
  const items = data.items.map((i) => ({
    id: i.id,
    name: i.name,
    status: i.status,
  }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(items, null, 2),
      },
    ],
  };
}
