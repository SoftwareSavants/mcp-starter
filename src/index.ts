import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getApiConfig } from "./auth.js";
import type { ToolResponse } from "./types.js";

// Import your tools here
import * as listItems from "./tools/list-items.js";
import * as getItem from "./tools/get-item.js";
import * as createItem from "./tools/create-item.js";
import * as search from "./tools/search.js";

// Register all tools — add or remove as needed
const tools = [listItems, getItem, createItem, search];

const server = new McpServer({
  name: "my-product", // Change to your product name
  version: "1.0.0",
});

// Get API config from environment
const config = getApiConfig();

// Register each tool with the server
for (const tool of tools) {
  server.tool(
    tool.definition.name,
    tool.definition.description,
    tool.definition.inputSchema.properties,
    async (args: Record<string, unknown>): Promise<ToolResponse> => {
      try {
        return await tool.handler(args, config);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred";
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
        };
      }
    },
  );
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
