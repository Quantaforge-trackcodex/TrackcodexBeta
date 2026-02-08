import simpleGit, { SimpleGit } from "simple-git";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export class GitService {
  private git: SimpleGit;
  private workspacesDir: string;

  constructor() {
    this.git = simpleGit();
    // Store cloned repositories in a workspaces directory
    this.workspacesDir = path.join(process.cwd(), "workspaces");
    this.ensureWorkspacesDir();
  }

  private async ensureWorkspacesDir() {
    if (!existsSync(this.workspacesDir)) {
      await fs.mkdir(this.workspacesDir, { recursive: true });
    }
  }

  /**
   * Clone a repository to a workspace directory
   * @param repoUrl - Git repository URL
   * @param workspaceId - Unique workspace identifier
   * @returns Path to the cloned repository
   */
  async cloneRepository(repoUrl: string, workspaceId: string): Promise<string> {
    const targetPath = path.join(this.workspacesDir, workspaceId);

    // Check if directory already exists
    if (existsSync(targetPath)) {
      throw new Error(`Workspace directory already exists: ${workspaceId}`);
    }

    try {
      console.log(`Cloning ${repoUrl} to ${targetPath}...`);

      // Clone the repository
      await this.git.clone(repoUrl, targetPath, {
        "--depth": 1, // Shallow clone for faster cloning
      });

      console.log(`Successfully cloned ${repoUrl}`);
      return targetPath;
    } catch (error: any) {
      console.error(`Failed to clone repository: ${error.message}`);

      // Clean up failed clone attempt
      if (existsSync(targetPath)) {
        await fs.rm(targetPath, { recursive: true, force: true });
      }

      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Validate if a URL is a valid Git repository URL
   * @param url - Repository URL to validate
   * @returns true if valid, false otherwise
   */
  isValidGitUrl(url: string): boolean {
    const gitUrlPatterns = [
      /^https?:\/\/.+\.git$/,
      /^https?:\/\/github\.com\/.+\/.+/,
      /^https?:\/\/gitlab\.com\/.+\/.+/,
      /^https?:\/\/bitbucket\.org\/.+\/.+/,
      /^git@.+:.+\.git$/,
    ];

    return gitUrlPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * Get repository information without cloning
   * @param repoUrl - Git repository URL
   * @returns Repository metadata
   */
  async getRepositoryInfo(repoUrl: string): Promise<{
    isValid: boolean;
    provider?: string;
    owner?: string;
    name?: string;
  }> {
    if (!this.isValidGitUrl(repoUrl)) {
      return { isValid: false };
    }

    // Extract provider, owner, and repo name from URL
    const githubMatch = repoUrl.match(/github\.com[\/:](.+?)\/(.+?)(\.git)?$/);
    const gitlabMatch = repoUrl.match(/gitlab\.com[\/:](.+?)\/(.+?)(\.git)?$/);
    const bitbucketMatch = repoUrl.match(
      /bitbucket\.org[\/:](.+?)\/(.+?)(\.git)?$/,
    );

    if (githubMatch) {
      return {
        isValid: true,
        provider: "github",
        owner: githubMatch[1],
        name: githubMatch[2],
      };
    } else if (gitlabMatch) {
      return {
        isValid: true,
        provider: "gitlab",
        owner: gitlabMatch[1],
        name: gitlabMatch[2],
      };
    } else if (bitbucketMatch) {
      return {
        isValid: true,
        provider: "bitbucket",
        owner: bitbucketMatch[1],
        name: bitbucketMatch[2],
      };
    }

    return { isValid: true, provider: "other" };
  }

  /**
   * Pull latest changes for an existing workspace
   * @param workspaceId - Workspace identifier
   */
  async pullLatestChanges(workspaceId: string): Promise<void> {
    const targetPath = path.join(this.workspacesDir, workspaceId);

    if (!existsSync(targetPath)) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const git = simpleGit(targetPath);
    await git.pull();
  }

  /**
   * Get the current branch of a workspace
   * @param workspaceId - Workspace identifier
   */
  async getCurrentBranch(workspaceId: string): Promise<string> {
    const targetPath = path.join(this.workspacesDir, workspaceId);

    if (!existsSync(targetPath)) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const git = simpleGit(targetPath);
    const status = await git.status();
    return status.current || "unknown";
  }

  /**
   * Delete a workspace directory
   * @param workspaceId - Workspace identifier
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    const targetPath = path.join(this.workspacesDir, workspaceId);

    if (existsSync(targetPath)) {
      await fs.rm(targetPath, { recursive: true, force: true });
      console.log(`Deleted workspace: ${workspaceId}`);
    }
  }
}

// Export singleton instance
export const gitService = new GitService();
