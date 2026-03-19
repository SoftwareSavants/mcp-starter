import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getApiConfig } from "./auth.js";
import type { ApiConfig } from "./types.js";

// Import your tools — each exports { name, description, params, handler }
import * as listItems from "./tools/list-items.js";
import * as getItem from "./tools/get-item.js";
import * as createItem from "./tools/create-item.js";
import * as search from "./tools/search.js";

/**
 * Creates an MCP server with all tools registered.
 * `getConfig` is called lazily so the config can differ per session
 * (e.g. each OAuth user gets their own token-backed config).
 */
function createServer(getConfig: () => ApiConfig): McpServer {
  const server = new McpServer({
    name: "my-product", // Change to your product name
    version: "1.0.0",
  });

  server.registerTool(listItems.name, {
    description: listItems.description,
    inputSchema: listItems.params,
  }, async (args) => listItems.handler(args, getConfig()));

  server.registerTool(getItem.name, {
    description: getItem.description,
    inputSchema: getItem.params,
  }, async (args) => getItem.handler(args, getConfig()));

  server.registerTool(createItem.name, {
    description: createItem.description,
    inputSchema: createItem.params,
  }, async (args) => createItem.handler(args, getConfig()));

  server.registerTool(search.name, {
    description: search.description,
    inputSchema: search.params,
  }, async (args) => search.handler(args, getConfig()));

  return server;
}

async function main() {
  const mode = process.argv.includes("--http") ? "http" : "stdio";

  if (mode === "http") {
    const { startHttp } = await import("./transports/http.js");
    await startHttp(createServer);
  } else {
    const config = getApiConfig();
    const server = createServer(() => config);
    const { startStdio } = await import("./transports/stdio.js");
    await startStdio(server);
  }
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
