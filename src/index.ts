import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getApiConfig } from "./auth.js";

// Import your tools — each exports { name, description, params, handler }
import * as listItems from "./tools/list-items.js";
import * as getItem from "./tools/get-item.js";
import * as createItem from "./tools/create-item.js";
import * as search from "./tools/search.js";

const server = new McpServer({
  name: "my-product", // Change to your product name
  version: "1.0.0",
});

const config = getApiConfig();

// Register tools — Zod schema is the single source of truth for
// both validation and TypeScript types. The SDK parses args against
// the schema and passes typed values to the callback.
server.registerTool(listItems.name, {
  description: listItems.description,
  inputSchema: listItems.params,
}, async (args) => listItems.handler(args, config));

server.registerTool(getItem.name, {
  description: getItem.description,
  inputSchema: getItem.params,
}, async (args) => getItem.handler(args, config));

server.registerTool(createItem.name, {
  description: createItem.description,
  inputSchema: createItem.params,
}, async (args) => createItem.handler(args, config));

server.registerTool(search.name, {
  description: search.description,
  inputSchema: search.params,
}, async (args) => search.handler(args, config));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
