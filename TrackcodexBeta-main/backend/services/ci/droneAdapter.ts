import { CIEngine } from "./engine";
import axios, { AxiosInstance } from "axios";

export class DroneAdapter implements CIEngine {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.DRONE_SERVER || "http://localhost:8080",
      headers: {
        Authorization: `Bearer ${process.env.DRONE_TOKEN || ""}`,
      },
    });
  }

  /**
   * Triggers a build in Drone.
   * Since Drone usually expects a .drone.yml in the repo, we rely on the
   * internal repository link or pass a configuration override if supported.
   */
  async createRun(options: {
    repoId: string;
    commitSha: string;
    branch: string;
    workflowId: string;
    env: Record<string, string>;
  }): Promise<{ externalId: string }> {
    console.log(
      `🔌 [DroneAdapter]: Triggering build for ${options.repoId} @ ${options.commitSha}`,
    );

    try {
      if (!process.env.DRONE_TOKEN) {
        // Mock Mode
        return { externalId: `drone-mock-${Date.now()}` };
      }

      // Real Drone API Call (POST /api/repos/:owner/:name/builds)
      // We assume repoId maps to a Drone repo slug (or we look it up)
      const slug = `trackcodex/${options.repoId}`;
      const response = await this.client.post(`/api/repos/${slug}/builds`, {
        branch: options.branch,
        commit: options.commitSha,
        // In advanced setups, we'd pass the YAML config here if using custom drone-cli
      });

      return { externalId: String(response.data.number) };
    } catch (error: any) {
      console.error("❌ [DroneAdapter]: Build trigger failed", error.message);
      throw new Error("Failed to trigger Drone build");
    }
  }

  async cancelRun(externalId: string): Promise<boolean> {
    try {
      if (!process.env.DRONE_TOKEN) return true;
      // POST /api/repos/:owner/:name/builds/:number/cancel
      return true;
    } catch (error) {
      return false;
    }
  }

  async getArtifacts(
    externalId: string,
  ): Promise<Array<{ name: string; url: string }>> {
    // Drone artifacts are usually handled by steps uploading to S3.
    // The adapter would query S3 or the Drone storage extension.
    return [];
  }

  async getLogs(
    externalId: string,
    jobId: string,
  ): Promise<NodeJS.ReadableStream> {
    // GET /api/repos/:owner/:name/builds/:build/logs/:stage/:step
    // Simplified: Return empty stream for now
    const { Readable } = await import("stream");
    return Readable.from(["[Drone] Mock Log Stream used.\n"]);
  }
}
