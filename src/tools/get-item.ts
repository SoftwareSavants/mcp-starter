import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  id: z.string().describe("Item ID"),
};

interface ItemDetail {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  description: string;
}

export const name = "get_item";
export const description = "Get item details by ID. Returns id, name, status, created date.";

export async function handler(
  args: { id: string },
  config: ApiConfig,
) {
  const item = await apiRequest<ItemDetail>(config, `/items/${args.id}`);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { id: item.id, name: item.name, status: item.status, created: item.createdAt, description: item.description },
          null, 2,
        ),
      },
    ],
  };
}
