import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * VS Code Workspace Provider
 *
 * Bridges TrackCodex workspaces to VS Code Web file system
 * Provides file access, watching, and Git operations
 */

interface WorkspaceConfig {
  id: string;
  name: string;
  path: string;
  userId: string;
}

export class VSCodeWorkspaceProvider {
  private workspaces: Map<string, WorkspaceConfig> = new Map();
  private workspaceRoot: string;

  constructor(workspaceRoot?: string) {
    // Default workspace location: project_root/workspaces
    this.workspaceRoot =
      workspaceRoot || path.join(process.cwd(), "workspaces");
  }

  async initialize() {
    // Ensure workspaces directory exists
    await fs.mkdir(this.workspaceRoot, { recursive: true });
    console.log("✅ VS Code Workspace Provider initialized");
    console.log(`   Workspace root: ${this.workspaceRoot}`);
  }

  /**
   * Register a workspace for VS Code access
   */
  async registerWorkspace(config: WorkspaceConfig): Promise<void> {
    const workspacePath = path.join(this.workspaceRoot, config.id);

    // Create workspace directory if it doesn't exist
    await fs.mkdir(workspacePath, { recursive: true });

    this.workspaces.set(config.id, {
      ...config,
      path: workspacePath,
    });

    console.log(`📁 Registered workspace: ${config.name} (${config.id})`);
  }

  /**
   * Get workspace configuration for VS Code
   */
  getWorkspace(workspaceId: string): WorkspaceConfig | undefined {
    return this.workspaces.get(workspaceId);
  }

  /**
   * Get workspace path by ID
   */
  getWorkspacePath(workspaceId: string): string | null {
    const workspace = this.workspaces.get(workspaceId);
    return workspace?.path || null;
  }

  /**
   * Read file from workspace
   */
  async readFile(workspaceId: string, filePath: string): Promise<string> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const fullPath = path.join(workspace.path, filePath);

    // Security: Ensure file is within workspace (prevent path traversal)
    if (!fullPath.startsWith(workspace.path)) {
      throw new Error("Access denied: Path traversal detected");
    }

    return await fs.readFile(fullPath, "utf-8");
  }

  /**
   * Write file to workspace
   */
  async writeFile(
    workspaceId: string,
    filePath: string,
    content: string,
  ): Promise<void> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const fullPath = path.join(workspace.path, filePath);

    // Security: Ensure file is within workspace
    if (!fullPath.startsWith(workspace.path)) {
      throw new Error("Access denied: Path traversal detected");
    }

    // Ensure parent directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await fs.writeFile(fullPath, content, "utf-8");
  }

  /**
   * List directory contents
   */
  async listDirectory(
    workspaceId: string,
    dirPath: string = "/",
  ): Promise<any[]> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const fullPath = path.join(workspace.path, dirPath);

    // Security check
    if (!fullPath.startsWith(workspace.path)) {
      throw new Error("Access denied: Path traversal detected");
    }

    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    return await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(fullPath, entry.name);
        const stats = await fs.stat(entryPath);

        return {
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
          path: path.relative(workspace.path, entryPath),
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      }),
    );
  }
}

/**
 * Register VS Code API routes
 */
export function registerVSCodeRoutes(
  fastify: FastifyInstance,
  workspaceProvider: VSCodeWorkspaceProvider,
) {
  // Get workspace configuration for VS Code
  fastify.get(
    "/api/vscode/workspace/:workspaceId/config",
    async (
      request: FastifyRequest<{ Params: { workspaceId: string } }>,
      reply: FastifyReply,
    ) => {
      const { workspaceId } = request.params;
      const workspace = workspaceProvider.getWorkspace(workspaceId);

      if (!workspace) {
        return reply.code(404).send({ error: "Workspace not found" });
      }

      return {
        workspaceId: workspace.id,
        name: workspace.name,
        path: workspace.path,
        folderUri: `file://${workspace.path}`,
      };
    },
  );

  // Read file
  fastify.get(
    "/api/vscode/workspace/:workspaceId/file",
    async (
      request: FastifyRequest<{
        Params: { workspaceId: string };
        Querystring: { path: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { workspaceId } = request.params;
      const { path: filePath } = request.query;

      try {
        const content = await workspaceProvider.readFile(workspaceId, filePath);
        return { content };
      } catch (error: any) {
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // Write file
  fastify.post(
    "/api/vscode/workspace/:workspaceId/file",
    async (
      request: FastifyRequest<{
        Params: { workspaceId: string };
        Body: { path: string; content: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { workspaceId } = request.params;
      const { path: filePath, content } = request.body;

      try {
        await workspaceProvider.writeFile(workspaceId, filePath, content);
        return { success: true };
      } catch (error: any) {
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  // List directory
  fastify.get(
    "/api/vscode/workspace/:workspaceId/list",
    async (
      request: FastifyRequest<{
        Params: { workspaceId: string };
        Querystring: { path?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { workspaceId } = request.params;
      const { path: dirPath = "/" } = request.query;

      try {
        const entries = await workspaceProvider.listDirectory(
          workspaceId,
          dirPath,
        );
        return { entries };
      } catch (error: any) {
        return reply.code(500).send({ error: error.message });
      }
    },
  );

  console.log("✅ VS Code API routes registered");
}
