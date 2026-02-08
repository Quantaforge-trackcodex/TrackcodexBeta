import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer";

const prisma = new PrismaClient();
const gitServer = new GitServer();

export interface SCMRepository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  techStack: string;
  techColor: string;
  lastUpdated: string;
}

/**
 * TrackCodex Native SCM Service
 * Handles repository lifecycle directly on the host or container filesystem.
 */
export class SCMService {
  /**
   * Provisions a new native git repository.
   */
  static async createRepository(data: {
    id: string;
    name: string;
    description?: string;
    techStack?: string;
  }): Promise<SCMRepository> {
    console.log(`🚀 SCM [Native]: Provisioning repository ${data.name}...`);

    // Initialize the bare repository locally
    const success = await gitServer.ensureRepoExists(data.id);
    if (!success) {
      throw new Error("Failed to initialize physical git repository");
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      stars: 0,
      forks: 0,
      techStack: data.techStack || "TypeScript",
      techColor: "#3178c6",
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get local file system path for a repository.
   */
  static async getRepoPath(repoId: string): Promise<string> {
    return gitServer.getRepoPath(repoId);
  }

  /**
   * Sync logic for Pull Requests (now powered by native git state)
   */
  static async syncPullRequests(repoId: string) {
    console.log(`📡 SCM [Native]: Synchronizing PRs for ${repoId}...`);
    // Future: Use isomorphic-git to parse refs/pull/* and update local PR records
    return await prisma.pullRequest.findMany({ where: { repoId } });
  }

  /**
   * Sync logic for Issues
   */
  static async syncIssues(repoId: string) {
    console.log(`📡 SCM [Native]: Synchronizing Issues for ${repoId}...`);
    return await prisma.issue.findMany({ where: { repoId } });
  }
}
