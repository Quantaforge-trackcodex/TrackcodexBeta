import { DockerService } from "./docker";

// Simple in-memory storage for active workspace ports
const activeWorkspaces = new Map<string, number>();
const START_PORT = 3001;

export class WorkspaceManager {
  // Get an available port
  static async allocatePort(): Promise<number> {
    let port = START_PORT;
    const usedPorts = Array.from(activeWorkspaces.values());
    while (usedPorts.includes(port)) {
      port++;
    }
    return port;
  }

  // Start a workspace container and return the access URL
  // Start a workspace (or get URL for code-server)
  static async startWorkspace(
    workspaceId: string,
  ): Promise<{ url: string; port: number }> {
    try {
      // Local code-server mode (Preferred for local dev)
      const workspacePath = require("path").join(process.cwd(), "workspaces", workspaceId);

      // Ensure workspace directory exists
      const fs = require("fs");
      if (!fs.existsSync(workspacePath)) {
        fs.mkdirSync(workspacePath, { recursive: true });
      }

      console.log(`[WorkspaceManager] Serving workspace ${workspaceId} via @vscode/test-web`);

      // @vscode/test-web mounts the project root at /static/mount
      // Workspaces are in ./workspaces/{id} relative to root
      return {
        url: `http://127.0.0.1:8080/?folder=/static/mount/workspaces/${workspaceId}`,
        port: 8080,
      };
    } catch (error: any) {
      console.error(
        `[WorkspaceManager] Failed to start workspace: ${error.message}`,
      );
      return {
        url: `http://localhost:8080`,
        port: 8080,
      };
    }
  }

  static async stopWorkspace(workspaceId: string) {
    const port = activeWorkspaces.get(workspaceId);
    if (port) {
      try {
        // Find container by name conventionally
        const containerName = `trackcodex-${workspaceId}`;
        const { docker } = await import("./docker");
        const container = docker.getContainer(containerName);
        await container.stop();
        activeWorkspaces.delete(workspaceId);
        console.log(`[Cloud] Stopped container for ${workspaceId}`);
      } catch (e: any) {
        console.warn(`[Cloud] Cleanup failed: ${e.message}`);
      }
    }
  }
}
