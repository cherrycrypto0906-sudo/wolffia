# MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate MCP server for Wolffia that exposes 5 business tools over HTTP on `127.0.0.1:3001`.

**Architecture:** Add a dedicated Node/Express runtime under `mcp-server/`, keep it isolated from the website server, and reuse shared business helpers for orders, leads, hero content, and email actions. The MCP service will provide a health endpoint plus a streamable HTTP MCP endpoint for goClaw on the same VPS.

**Tech Stack:** Node.js, Express, `@modelcontextprotocol/sdk`, existing app APIs/helpers, JSON file updates, systemd on VPS.

---

### Task 1: Add MCP runtime skeleton

**Files:**
- Create: `mcp-server/server.js`
- Create: `mcp-server/registerTools.js`
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Add the MCP SDK dependency and scripts**

```json
{
  "scripts": {
    "start:mcp": "node mcp-server/server.js"
  }
}
```

Run: `npm install @modelcontextprotocol/sdk`
Expected: package installs successfully and `package-lock.json` updates.

- [ ] **Step 2: Create the MCP HTTP server shell**

```js
import express from 'express';
import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
```

The runtime should:
- load env
- listen on `process.env.MCP_PORT || 3001`
- bind to `127.0.0.1`
- expose `/health`
- expose `/mcp`

- [ ] **Step 3: Register an empty tool container and boot the transport**

Run: `node mcp-server/server.js`
Expected: logs show MCP server listening on `127.0.0.1:3001`.

### Task 2: Extract shared business data helpers

**Files:**
- Create: `lib/businessData.js`
- Create: `lib/contentUpdate.js`
- Test: `tests/businessData.test.js`

- [ ] **Step 1: Write failing tests for order/lead summarization helpers**

```js
test('summarizeOrdersByDate counts paid, pending, and revenue correctly', () => {
  // use 2 paid orders and 1 pending order on the same date
});

test('filterSurveyLeadsByDate returns the newest matching leads first', () => {
  // use lead fixtures with different dates
});
```

Run: `node --test tests/businessData.test.js`
Expected: FAIL because helpers do not exist yet.

- [ ] **Step 2: Implement shared helpers**

Helpers should cover:
- fetch all admin data through existing `api/admin-db`-style Apps Script logic
- summarize orders by date
- filter waitlist leads by date
- update an order to `paid`
- send follow-up emails by delegating to existing email logic

- [ ] **Step 3: Add hero content update helper**

The helper should:
- read the current file content
- whitelist the hero fields that may change
- write only approved fields
- return a preview payload

- [ ] **Step 4: Re-run tests**

Run: `node --test tests/businessData.test.js`
Expected: PASS

### Task 3: Implement the 5 MCP tools

**Files:**
- Modify: `mcp-server/registerTools.js`
- Test: `tests/mcpTools.test.js`

- [ ] **Step 1: Write failing tests for tool-level behavior**

Add one failing test per tool:
- `today_orders_summary`
- `list_new_waitlist_leads`
- `update_hero_content`
- `mark_order_paid`
- `send_followup_email_to_lead`

Run: `node --test tests/mcpTools.test.js`
Expected: FAIL

- [ ] **Step 2: Register the tools with schemas and handlers**

Each tool should:
- validate input
- call the relevant helper
- return plain JSON-safe output

- [ ] **Step 3: Re-run the MCP tool tests**

Run: `node --test tests/mcpTools.test.js`
Expected: PASS

### Task 4: Local integration verification

**Files:**
- Modify: `deploy_notes.md`

- [ ] **Step 1: Verify all tests together**

Run: `npm test`
Expected: all tests pass

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: Vite build passes without regression

- [ ] **Step 3: Verify MCP server starts locally**

Run: `node mcp-server/server.js`
Expected: service starts and logs the local MCP URL

- [ ] **Step 4: Verify health endpoint**

Run: `curl http://127.0.0.1:3001/health`
Expected: JSON with `ok: true`

### Task 5: Production deploy for the MCP service

**Files:**
- Modify: `deploy_notes.md`

- [ ] **Step 1: Commit and push the MCP branch changes**

```bash
git add .
git commit -m "Add Wolffia MCP server"
git push
```

- [ ] **Step 2: Deploy to VPS**

Use the existing VPS flow to:
- pull latest code
- run `npm install`
- create a `mywebsite-mcp` or `mcp-server` systemd service
- start it on `127.0.0.1:3001`

- [ ] **Step 3: Verify on VPS**

Run:

```bash
curl http://127.0.0.1:3001/health
systemctl status mcp-server
```

Expected:
- health endpoint responds
- service is `active (running)`

- [ ] **Step 4: Prepare goClaw connection details**

Document:
- transport: `streamable-http`
- URL: `http://127.0.0.1:3001/mcp`
- suggested tool prefix: `biz`
