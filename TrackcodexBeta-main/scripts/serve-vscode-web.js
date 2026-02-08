#!/usr/bin/env node

/**
 * TrackCodex VS Code Web Server
 * Serves compiled VS Code Web with workspace integration
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const VSCODE_WEB_ROOT = path.join(
  PROJECT_ROOT,
  ".vscode_engine",
  "out-vscode-web",
);
const PORT = process.env.VSCODE_WEB_PORT || 8080;

// Verify VS Code Web build exists
if (!fs.existsSync(VSCODE_WEB_ROOT)) {
  console.error("❌ VS Code Web build not found!");
  console.error("   Expected location:", VSCODE_WEB_ROOT);
  console.error("\n   Please build VS Code Web first:");
  console.error("   npm run build:vscode\n");
  process.exit(1);
}

const app = express();

// CORS for TrackCodex iframe embedding
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Security headers
app.use((req, res, next) => {
  // Allow iframe embedding from localhost:3000 (TrackCodex)
  res.header("X-Frame-Options", "ALLOW-FROM http://localhost:3000");
  res.header(
    "Content-Security-Policy",
    "frame-ancestors 'self' http://localhost:3000",
  );
  next();
});

// Serve VS Code Web static files
app.use(
  express.static(VSCODE_WEB_ROOT, {
    setHeaders: (res, filePath) => {
      // Set correct MIME types for VS Code resources
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (filePath.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
      }
    },
  }),
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TrackCodex VS Code Web",
    version: "1.0.0",
  });
});

// Workspace configuration endpoint
app.get("/api/workspace-config", (req, res) => {
  const workspaceId = req.query.workspaceId;
  const workspacePath = req.query.workspacePath;

  res.json({
    workspaceId,
    workspacePath,
    authEndpoint: "http://localhost:4000/api/vscode/auth",
    fileSystemEndpoint: "http://localhost:4000/api/vscode/fs",
  });
});

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(VSCODE_WEB_ROOT, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("\n🚀 TrackCodex VS Code Web Server\n");
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${VSCODE_WEB_ROOT}`);
  console.log("\n🔗 Integration with TrackCodex:");
  console.log(`   Main App:     http://localhost:3000`);
  console.log(`   VS Code Web:  http://localhost:${PORT}`);
  console.log(`   Backend API:  http://localhost:4000`);
  console.log("\n✨ VS Code Web is ready for TrackCodex embedding!\n");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down VS Code Web server...");
  process.exit(0);
});
