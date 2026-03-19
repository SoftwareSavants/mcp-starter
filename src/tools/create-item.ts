import type { ApiConfig, ToolResponse } from "../types.js";
import { apiRequest } from "../auth.js";

export const definition = {
  name: "create_item",
  description: "Create a new item. Returns the created item's id and name.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "Item name",
      },
      description: {
        type: "string",
        description: "Item description (optional)",
      },
    },
    required: ["name"],
  },
};

interface CreatedItem {
  id: string;
  name: string;
}

export async function handler(
  args: Record<string, unknown>,
  config: ApiConfig,
): Promise<ToolResponse> {
  const item = await apiRequest<CreatedItem>(config, "/items", {
    method: "POST",
    body: JSON.stringify({
      name: args.name,
      description: args.description ?? "",
    }),
  });

  return {
    content: [
      {
        type: "text",
        text: `Created item "${item.name}" (ID: ${item.id})`,
      },
    ],
  };
}
