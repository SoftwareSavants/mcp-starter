# MCP Server Starter Template

A minimal, production-ready MCP server template built with TypeScript. Clone this, replace the example tools with your API, and your users can interact with your product through Claude, Cursor, or any MCP-compatible AI agent.

**Built lean by design** — exposes only what users need, with token-efficient tool descriptions and structured responses.

## Quick Start

```bash
# Clone
git clone https://github.com/SoftwareSavants/mcp-starter.git
cd mcp-starter

# Install
npm install

# Run
npm start
```

Then add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "my-product": {
      "command": "node",
      "args": ["path/to/mcp-starter/dist/index.js"],
      "env": {
        "API_BASE_URL": "https://api.yourproduct.com",
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## What's Included

- `src/index.ts` — Server entry point with MCP protocol setup
- `src/tools/` — Example tools (list, get, create, search) you replace with your API
- `src/auth.ts` — API key authentication handler
- `src/types.ts` — Shared types
- Built-in error handling with user-friendly messages
- Token-efficient tool descriptions (lean, not bloated)

## How to Customize

### 1. Define your tools

Edit `src/tools/` — each file exports one tool. A tool has:

```typescript
export const listItems: Tool = {
  name: "list_items",
  description: "List items with optional filters. Returns name, ID, and status.", // Keep it SHORT
  inputSchema: {
    type: "object",
    properties: {
      status: { type: "string", enum: ["active", "archived"], description: "Filter by status" },
      limit: { type: "number", description: "Max results (default 10)" },
    },
  },
  handler: async (args) => {
    const data = await api.get("/items", { params: args });
    // Return ONLY what the agent needs — not the full API response
    return data.items.map(i => ({ id: i.id, name: i.name, status: i.status }));
  },
};
```

### 2. Connect your API

Update `src/auth.ts` with your authentication method and `API_BASE_URL` in env.

### 3. Keep it lean

- **5-10 tools max.** Only expose what users actually do through AI.
- **Short descriptions.** One sentence. The LLM reads every tool description on every request.
- **Structured responses.** Return `{ id, name, status }` not the full database row.
- **No nested JSON blobs.** Flatten where possible.

## Design Principles

This template follows the "Built Lean" philosophy:

1. **Minimal tool surface** — fewer tools = agent picks the right one every time
2. **Token-efficient descriptions** — every character in a tool description costs tokens on every request
3. **Structured responses** — clean returns that keep the context window lean
4. **Fail gracefully** — clear error messages the agent can relay to the user

## Need a Production MCP Server?

This template gets you started. For a production-grade MCP server with auth, permissions, documentation, and ongoing maintenance — [talk to us](https://www.software-savants.com/en/mcp-development).

**Software Savants** — the AI-native product studio. We build lean MCP servers that don't bloat the context window.

## License

MIT
