import { z } from "zod";
import type { ApiConfig } from "../types.js";
import { apiRequest } from "../auth.js";

export const params = {
  id: z.number().describe("Product ID"),
};

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  brand: string;
}

export const name = "get_item";
export const description = "Get product details by ID. Returns title, description, price, rating.";

export async function handler(
  args: { id: number },
  config: ApiConfig,
) {
  const item = await apiRequest<ProductDetail>(config, `/products/${args.id}`);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { id: item.id, title: item.title, description: item.description, category: item.category, price: item.price, rating: item.rating, brand: item.brand },
          null, 2,
        ),
      },
    ],
  };
}
