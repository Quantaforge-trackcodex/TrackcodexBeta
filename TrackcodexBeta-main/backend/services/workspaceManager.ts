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
  static async startWorkspace(
    workspaceId: string,
  ): Promise<{ url: string; port: number }> {
    try {
      // Allocate a port for this session
      const port = await this.allocatePort();

      // Real Docker Backend Execution
      const containerInfo = await DockerService.createContainer(
        workspaceId,
        "gitpod/openvscode-server:latest",
        port,
      );

      activeWorkspaces.set(workspaceId, port);

      return {
        url: `http://localhost:${port}`,
        port: port,
      };
    } catch (error: any) {
      console.error(
        `[WorkspaceManager] Container start failed: ${error.message}. Falling back to simulator.`,
      );
      // Fallback to simulator if Docker fails
      return {
        url: `http://localhost:3000/ide-shim/${workspaceId}`,
        port: 3000,
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
