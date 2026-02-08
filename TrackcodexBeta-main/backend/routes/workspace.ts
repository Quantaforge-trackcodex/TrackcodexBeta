import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

/**
 * Workspace API Routes
 * Backend endpoints for TrackCodex IDE workspace integration
 */

const WORKSPACES_DIR = path.join(process.cwd(), "workspaces");

// Ensure workspaces directory exists
async function ensureWorkspacesDir() {
  if (!existsSync(WORKSPACES_DIR)) {
    await fs.mkdir(WORKSPACES_DIR, { recursive: true });
    console.log("📁 Created workspaces directory:", WORKSPACES_DIR);
  }
}

export async function registerWorkspaceRoutes(fastify: FastifyInstance) {
  await ensureWorkspacesDir();

  // Get workspace files
  fastify.get(
    "/api/workspace/:id/files",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const workspaceDir = path.join(WORKSPACES_DIR, id);

      try {
        // Create workspace if doesn't exist
        if (!existsSync(workspaceDir)) {
          await fs.mkdir(workspaceDir, { recursive: true });
          await createDemoWorkspace(workspaceDir);
        }

        const files = await readDirectory(workspaceDir, "");
        return reply.send(files);
      } catch (error: any) {
        console.error("Error reading workspace files:", error);
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // Get file content
  fastify.get(
    "/api/workspace/:id/file",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Querystring: { path: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { path: filePath } = request.query;

      const fullPath = path.join(WORKSPACES_DIR, id, filePath);

      // Security: Prevent path traversal
      if (!fullPath.startsWith(path.join(WORKSPACES_DIR, id))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        const content = await fs.readFile(fullPath, "utf-8");
        return reply.send({ content });
      } catch (error: any) {
        console.error("Error reading file:", error);
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // Save file content
  fastify.post(
    "/api/workspace/:id/file",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { path: string; content: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { path: filePath, content } = request.body;

      const fullPath = path.join(WORKSPACES_DIR, id, filePath);

      // Security: Prevent path traversal
      if (!fullPath.startsWith(path.join(WORKSPACES_DIR, id))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, "utf-8");

        console.log("✅ File saved:", filePath);
        return reply.send({ success: true });
      } catch (error: any) {
        console.error("Error saving file:", error);
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // Create new file
  fastify.post(
    "/api/workspace/:id/file/create",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { dirPath: string; fileName: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { dirPath, fileName } = request.body;

      const fullPath = path.join(WORKSPACES_DIR, id, dirPath, fileName);

      // Security check
      if (!fullPath.startsWith(path.join(WORKSPACES_DIR, id))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, "", "utf-8");

        const newFile = {
          id: Date.now().toString(),
          name: fileName,
          path: path.join(dirPath, fileName),
          type: "file" as const,
          content: "",
        };

        return reply.send(newFile);
      } catch (error: any) {
        console.error("Error creating file:", error);
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // Delete file
  fastify.delete(
    "/api/workspace/:id/file",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { path: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { path: filePath } = request.body;

      const fullPath = path.join(WORKSPACES_DIR, id, filePath);

      // Security check
      if (!fullPath.startsWith(path.join(WORKSPACES_DIR, id))) {
        return reply.code(403).send({ error: "Access denied" });
      }

      try {
        await fs.unlink(fullPath);
        return reply.send({ success: true });
      } catch (error: any) {
        console.error("Error deleting file:", error);
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  console.log("✅ Workspace API routes registered");
}

// Helper: Read directory recursively
async function readDirectory(
  dirPath: string,
  relativePath: string,
): Promise<any[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      const children = await readDirectory(fullPath, relPath);
      files.push({
        id: relPath,
        name: entry.name,
        path: "/" + relPath.replace(/\\/g, "/"),
        type: "directory",
        children,
      });
    } else {
      files.push({
        id: relPath,
        name: entry.name,
        path: "/" + relPath.replace(/\\/g, "/"),
        type: "file",
        language: getLanguageFromExtension(entry.name),
      });
    }
  }

  return files;
}

// Helper: Get language from file extension
function getLanguageFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".json": "json",
    ".md": "markdown",
    ".css": "css",
    ".html": "html",
    ".py": "python",
    ".rs": "rust",
    ".go": "go",
  };
  return map[ext] || "plaintext";
}

// Helper: Create demo workspace
async function createDemoWorkspace(workspaceDir: string) {
  const srcDir = path.join(workspaceDir, "src");
  await fs.mkdir(srcDir, { recursive: true });

  // Create demo files
  await fs.writeFile(
    path.join(workspaceDir, "README.md"),
    `# TrackCodex Workspace\n\nWelcome to your development workspace!\n\n## Get Started\nStart editing files to begin coding.`,
  );

  await fs.writeFile(
    path.join(srcDir, "index.ts"),
    `// Welcome to TrackCodex IDE\nconsole.log('Hello, TrackCodex!');\n`,
  );

  await fs.writeFile(
    path.join(workspaceDir, "package.json"),
    JSON.stringify(
      {
        name: "trackcodex-workspace",
        version: "1.0.0",
        description: "TrackCodex workspace project",
      },
      null,
      2,
    ),
  );

  console.log("✅ Created demo workspace:", workspaceDir);
}
