import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { registerBusinessTools } from './registerTools.js';

dotenv.config();

const HOST = process.env.MCP_HOST || '127.0.0.1';
const PORT = Number(process.env.MCP_PORT || 3001);

const app = createMcpExpressApp({ host: HOST });
const transports = {};

const createServer = () => {
  const server = new McpServer({
    name: 'wolffia-business-mcp',
    version: '1.0.0',
  }, {
    capabilities: {
      logging: {},
    },
  });

  registerBusinessTools(server);
  return server;
};

app.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'wolffia-business-mcp',
    host: HOST,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.post('/mcp', async (req, res) => {
  try {
    const sessionId = req.headers['mcp-session-id'];
    let transport;

    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (newSessionId) => {
          transports[newSessionId] = transport;
        },
      });

      const server = createServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error.message || 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/mcp', (_req, res) => {
  res.status(405).set('Allow', 'POST').send('Method Not Allowed');
});

app.delete('/mcp', (_req, res) => {
  res.status(405).set('Allow', 'POST').send('Method Not Allowed');
});

app.listen(PORT, HOST, (error) => {
  if (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }

  console.log(`Wolffia MCP server listening on http://${HOST}:${PORT}/mcp`);
});
