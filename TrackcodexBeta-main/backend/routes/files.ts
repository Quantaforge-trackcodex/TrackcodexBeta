import { FastifyInstance } from "fastify";
import fs from "fs/promises";
import path from "path";
import { RealtimeService } from "../services/realtime";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "workspaces");

export async function fileRoutes(fastify: FastifyInstance) {
  // Ensure storage root exists
  await fs.mkdir(STORAGE_ROOT, { recursive: true });

  // List files for a workspace
  fastify.get("/files", async (request, reply) => {
    const { workspaceId } = request.query as { workspaceId: string };
    if (!workspaceId)
      return reply.code(400).send({ error: "Missing workspaceId" });

    const wsPath = path.join(STORAGE_ROOT, workspaceId);
    await fs.mkdir(wsPath, { recursive: true });

    const getTree = async (dir: string): Promise<any[]> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const nodes = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(wsPath, fullPath);

          if (entry.isDirectory()) {
            return {
              id: relativePath,
              name: entry.name,
              type: "folder",
              children: await getTree(fullPath),
            };
          } else {
            return {
              id: relativePath,
              name: entry.name,
              type: "file",
            };
          }
        }),
      );
      return nodes;
    };

    try {
      const tree = await getTree(wsPath);
      return tree;
    } catch (err) {
      return reply.code(500).send({ error: "Failed to read file tree" });
    }
  });

  // Get file content
  fastify.get("/files/:filePath", async (request, reply) => {
    const { workspaceId } = request.query as { workspaceId: string };
    const { filePath } = request.params as { filePath: string };

    if (!workspaceId)
      return reply.code(400).send({ error: "Missing workspaceId" });

    const fullPath = path.join(STORAGE_ROOT, workspaceId, filePath);

    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return { content };
    } catch (err) {
      return reply.code(404).send({ error: "File not found" });
    }
  });

  // Save file content
  fastify.post("/files/:filePath", async (request, reply) => {
    const { workspaceId } = request.query as { workspaceId: string };
    const { filePath } = request.params as { filePath: string };
    const { content } = request.body as { content: string };

    if (!workspaceId)
      return reply.code(400).send({ error: "Missing workspaceId" });

    const fullPath = path.join(STORAGE_ROOT, workspaceId, filePath);

    try {
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf-8");

      // Broadcast update via Realtime to sync all users
      RealtimeService.broadcastToRoom(workspaceId, {
        type: "FILE_SAVED",
        filePath,
      });

      return { success: true };
    } catch (err) {
      return reply.code(500).send({ error: "Failed to save file" });
    }
  });
}
