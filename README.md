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

# Configure (pre-filled with DummyJSON — works out of the box)
cp .env.example .env

# Build & run
npm run build
npm start
```

Then add to your Claude Desktop config (`~/Library/Application\ Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "my-product": {
      "command": "node",
      "args": [
        "--env-file=path/to/mcp-starter/.env",
        "path/to/mcp-starter/dist/index.js"
      ]
    }
  }
}
```

## Transport Modes

This template supports two transport modes. Use whichever fits your deployment:

|              | **Stdio (default)**       | **HTTP + OAuth**               |
| ------------ | ------------------------- | ------------------------------ |
| **Auth**     | API key via env var       | OAuth 2.1 (PKCE)               |
| **Best for** | Local dev, Claude Desktop | Production, multi-user, remote |
| **Run**      | `npm start`               | `npm run start:http`           |

### Stdio Mode (API Key)

The default. Set `API_BASE_URL` and `API_KEY` as environment variables — the server authenticates all API calls with the key.

### HTTP Mode (OAuth)

Runs an Express server with full OAuth 2.1 support. The MCP server acts as a proxy — it delegates authentication to your upstream OAuth provider (e.g. your product's existing OAuth server).

```bash
# Required environment variables for OAuth mode
export API_BASE_URL="https://api.yourproduct.com"
export OAUTH_AUTHORIZATION_URL="https://auth.yourproduct.com/authorize"
export OAUTH_TOKEN_URL="https://auth.yourproduct.com/token"
export OAUTH_USERINFO_URL="https://api.yourproduct.com/userinfo"
export OAUTH_CLIENT_ID="your-oauth-client-id"
export OAUTH_CLIENT_SECRET="your-oauth-client-secret"
export OAUTH_SCOPES="read,write"           # comma-separated
export OAUTH_ISSUER_URL="https://mcp.yourproduct.com"  # optional, defaults to http://localhost:3000
export PORT=3000                           # optional

npm run start:http
```

Claude Desktop config for HTTP mode:

```json
{
  "mcpServers": {
    "my-product": {
      "url": "https://mcp.yourproduct.com/mcp"
    }
  }
}
```

**How it works:**

1. Client connects to `/mcp` and gets redirected to your OAuth provider
2. User authorizes the MCP client with your service
3. Client receives an access token and sends it with each MCP request
4. The server verifies the token and uses it to call your API on behalf of the user

## What's Included

- `src/index.ts` — Server entry point, registers tools, picks transport mode
- `src/tools/` — Example tools (list, get, create, search) you replace with your API
- `src/auth.ts` — API key and OAuth token authentication
- `src/types.ts` — Shared types
- `src/transports/stdio.ts` — Stdio transport (default)
- `src/transports/http.ts` — HTTP transport with OAuth middleware
- `src/oauth-provider.ts` — Proxy OAuth provider config
- Built-in error handling with user-friendly messages
- Token-efficient tool descriptions (lean, not bloated)

## How to Customize

### 1. Define your tools

Edit `src/tools/` — each file exports one tool. A tool has:

```typescript
export const listItems: Tool = {
  name: "list_items",
  description:
    "List items with optional filters. Returns name, ID, and status.", // Keep it SHORT
  inputSchema: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["active", "archived"],
        description: "Filter by status",
      },
      limit: { type: "number", description: "Max results (default 10)" },
    },
  },
  handler: async (args) => {
    const data = await api.get("/items", { params: args });
    // Return ONLY what the agent needs — not the full API response
    return data.items.map((i) => ({
      id: i.id,
      name: i.name,
      status: i.status,
    }));
  },
};
```

### 2. Connect your API

Update `src/auth.ts` with your authentication method and `API_BASE_URL` in env.

### 3. Configure OAuth (if using HTTP mode)

Update `src/oauth-provider.ts` with your token verification logic. The default uses a userinfo endpoint — adapt it to however your service validates tokens (JWT verification, introspection endpoint, etc.).

### 4. Keep it lean

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
