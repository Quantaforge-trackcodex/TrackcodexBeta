import { Octokit } from "@octokit/rest";
import simpleGit, { SimpleGit } from "simple-git";

export interface CommitSnapshot {
  sha: string;
  date: string;
  author: string;
  message: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface TemporalComparison {
  from: CommitSnapshot;
  to: CommitSnapshot;
  files: {
    path: string;
    status: "added" | "modified" | "deleted";
    additions: number;
    deletions: number;
  }[];
  totalChanges: {
    filesChanged: number;
    additions: number;
    deletions: number;
  };
}

export class TemporalDebugger {
  private octokit: Octokit;
  private git: SimpleGit;

  constructor(githubToken: string, localRepoPath?: string) {
    this.octokit = new Octokit({ auth: githubToken });
    this.git = simpleGit(localRepoPath || process.cwd());
  }

  /**
   * Get commit history for the last N days
   */
  async getCommitHistory(
    owner: string,
    repo: string,
    days: number = 30,
  ): Promise<CommitSnapshot[]> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data } = await this.octokit.repos.listCommits({
        owner,
        repo,
        since: since.toISOString(),
        per_page: 100,
      });

      const snapshots: CommitSnapshot[] = [];

      for (const commit of data) {
        const { data: commitDetail } = await this.octokit.repos.getCommit({
          owner,
          repo,
          ref: commit.sha,
        });

        snapshots.push({
          sha: commit.sha,
          date: commit.commit.author?.date || new Date().toISOString(),
          author: commit.commit.author?.name || "Unknown",
          message: commit.commit.message,
          filesChanged: commitDetail.files?.length || 0,
          additions: commitDetail.stats?.additions || 0,
          deletions: commitDetail.stats?.deletions || 0,
        });
      }

      return snapshots;
    } catch (error) {
      console.error("Error fetching commit history:", error);
      return [];
    }
  }

  /**
   * Compare two temporal points (commits)
   */
  async compareSnapshots(
    owner: string,
    repo: string,
    fromSha: string,
    toSha: string,
  ): Promise<TemporalComparison | null> {
    try {
      const { data: comparison } = await this.octokit.repos.compareCommits({
        owner,
        repo,
        base: fromSha,
        head: toSha,
      });

      const fromCommit = await this.octokit.repos.getCommit({
        owner,
        repo,
        ref: fromSha,
      });

      const toCommit = await this.octokit.repos.getCommit({
        owner,
        repo,
        ref: toSha,
      });

      const files =
        comparison.files?.map((file) => ({
          path: file.filename,
          status: file.status as "added" | "modified" | "deleted",
          additions: file.additions,
          deletions: file.deletions,
        })) || [];

      return {
        from: {
          sha: fromSha,
          date: fromCommit.data.commit.author?.date || "",
          author: fromCommit.data.commit.author?.name || "Unknown",
          message: fromCommit.data.commit.message,
          filesChanged: fromCommit.data.files?.length || 0,
          additions: fromCommit.data.stats?.additions || 0,
          deletions: fromCommit.data.stats?.deletions || 0,
        },
        to: {
          sha: toSha,
          date: toCommit.data.commit.author?.date || "",
          author: toCommit.data.commit.author?.name || "Unknown",
          message: toCommit.data.commit.message,
          filesChanged: toCommit.data.files?.length || 0,
          additions: toCommit.data.stats?.additions || 0,
          deletions: toCommit.data.stats?.deletions || 0,
        },
        files,
        totalChanges: {
          filesChanged: comparison.files?.length || 0,
          additions:
            comparison.files?.reduce((sum, f) => sum + f.additions, 0) || 0,
          deletions:
            comparison.files?.reduce((sum, f) => sum + f.deletions, 0) || 0,
        },
      };
    } catch (error) {
      console.error("Error comparing snapshots:", error);
      return null;
    }
  }

  /**
   * Get file content at a specific commit
   */
  async getFileAtCommit(
    owner: string,
    repo: string,
    path: string,
    sha: string,
  ): Promise<string | null> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: sha,
      });

      if ("content" in data && data.content) {
        return Buffer.from(data.content, "base64").toString("utf-8");
      }

      return null;
    } catch (error) {
      console.error("Error fetching file at commit:", error);
      return null;
    }
  }

  /**
   * Get repository tree at a specific commit
   */
  async getTreeAtCommit(
    owner: string,
    repo: string,
    sha: string,
  ): Promise<any[]> {
    try {
      const { data } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: sha,
        recursive: "true",
      });

      return data.tree;
    } catch (error) {
      console.error("Error fetching tree at commit:", error);
      return [];
    }
  }

  /**
   * Get local commit history using simple-git
   */
  async getLocalCommitHistory(days: number = 30): Promise<CommitSnapshot[]> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const log = await this.git.log({
        "--since": since.toISOString(),
        "--max-count": "100",
      });

      return log.all.map((commit) => ({
        sha: commit.hash,
        date: commit.date,
        author: commit.author_name,
        message: commit.message,
        filesChanged: 0, // simple-git doesn't provide this in log
        additions: 0,
        deletions: 0,
      }));
    } catch (error) {
      console.error("Error fetching local commit history:", error);
      return [];
    }
  }
}
