import type { ApiConfig, ToolResponse } from "../types.js";
import { apiRequest } from "../auth.js";

export const definition = {
  name: "get_item",
  description: "Get item details by ID. Returns id, name, status, created date.",
  inputSchema: {
    type: "object" as const,
    properties: {
      id: {
        type: "string",
        description: "Item ID",
      },
    },
    required: ["id"],
  },
};

interface ItemDetail {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  description: string;
}

export async function handler(
  args: Record<string, unknown>,
  config: ApiConfig,
): Promise<ToolResponse> {
  const item = await apiRequest<ItemDetail>(config, `/items/${args.id}`);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            id: item.id,
            name: item.name,
            status: item.status,
            created: item.createdAt,
            description: item.description,
          },
          null,
          2,
        ),
      },
    ],
  };
}
