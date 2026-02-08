import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const gitServer = new GitServer();

interface DiffStats {
  additions: number;
  deletions: number;
  changedFiles: number;
}

export class PullRequestService {
  /**
   * Create a new Pull Request
   */
  static async createPullRequest(
    repoId: string,
    base: string,
    head: string,
    title: string,
    body: string | null,
    authorId: string,
    draft: boolean = false,
  ) {
    // Get next PR number for this repo
    const lastPR = await prisma.pullRequest.findFirst({
      where: { repoId },
      orderBy: { number: "desc" },
    });
    const number = (lastPR?.number || 0) + 1;

    // Calculate diff stats
    const diffStats = await this.getDiffStats(repoId, base, head);

    // Create PR
    const pr = await prisma.pullRequest.create({
      data: {
        repoId,
        number,
        title,
        body,
        base,
        head,
        authorId,
        draft,
        status: "OPEN",
        diffStats: diffStats as any,
      },
      include: {
        author: true,
        repo: true,
      },
    });

    // Handle CODEOWNERS governance
    try {
      const { CodeOwnersService } = await import("./codeOwnersService.js");
      const changedFiles = await this.getChangedFiles(repoId, base, head);
      await CodeOwnersService.applyCodeOwnersToPR(repoId, pr.id, changedFiles);
    } catch (e) {
      console.error("⚠️ [PR] Failed to apply CODEOWNERS rules:", e);
    }

    console.log(`✅ Created PR #${number}: ${title}`);
    return pr;
  }

  /**
   * Get diff stats between two branches
   */
  static async getDiffStats(
    repoId: string,
    base: string,
    head: string,
  ): Promise<DiffStats> {
    const repoPath = gitServer.getRepoPath(repoId);

    return new Promise((resolve, reject) => {
      const p = spawn("git", ["diff", "--shortstat", `${base}...${head}`], {
        cwd: repoPath,
      });

      let output = "";
      p.stdout.on("data", (data) => (output += data.toString()));

      p.on("close", (code) => {
        if (code !== 0) {
          return resolve({ additions: 0, deletions: 0, changedFiles: 0 });
        }

        // Parse: "3 files changed, 45 insertions(+), 12 deletions(-)"
        const match = output.match(
          /(\d+) file[s]? changed(?:, (\d+) insertion[s]?\(\+\))?(?:, (\d+) deletion[s]?\(-\))?/,
        );

        resolve({
          changedFiles: match ? parseInt(match[1]) : 0,
          additions: match && match[2] ? parseInt(match[2]) : 0,
          deletions: match && match[3] ? parseInt(match[3]) : 0,
        });
      });
    });
  }

  /**
   * Get list of changed files between two branches
   */
  static async getChangedFiles(
    repoId: string,
    base: string,
    head: string,
  ): Promise<string[]> {
    const repoPath = gitServer.getRepoPath(repoId);

    return new Promise((resolve, reject) => {
      const p = spawn("git", ["diff", "--name-only", `${base}...${head}`], {
        cwd: repoPath,
      });

      let output = "";
      p.stdout.on("data", (data) => (output += data.toString()));

      p.on("close", (code) => {
        if (code !== 0) return resolve([]);
        const files = output
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);
        resolve(files);
      });
    });
  }

  /**
   * Get full diff between branches
   */

  /**
   * Get full diff between branches
   */
  static async getDiff(
    repoId: string,
    base: string,
    head: string,
  ): Promise<string> {
    const repoPath = gitServer.getRepoPath(repoId);

    return new Promise((resolve, reject) => {
      const p = spawn("git", ["diff", `${base}...${head}`], {
        cwd: repoPath,
      });

      let output = "";
      p.stdout.on("data", (data) => (output += data.toString()));

      p.on("close", (code) => {
        if (code !== 0) return reject(new Error("Git diff failed"));
        resolve(output);
      });
    });
  }

  /**
   * List Pull Requests
   */
  static async listPullRequests(repoId: string, status?: string) {
    return prisma.pullRequest.findMany({
      where: {
        repoId,
        ...(status && { status }),
      },
      include: {
        author: true,
        reviews: {
          include: { reviewer: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get single PR with details
   */
  static async getPullRequest(prId: string) {
    return prisma.pullRequest.findUnique({
      where: { id: prId },
      include: {
        author: true,
        repo: true,
        reviews: {
          include: { reviewer: true },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
        labels: true,
      },
    });
  }

  /**
   * Merge Pull Request
   */
  static async mergePullRequest(
    prId: string,
    userId: string,
    method: "merge" | "squash" | "rebase" = "merge",
  ) {
    const pr = await prisma.pullRequest.findUnique({
      where: { id: prId },
      include: { repo: true },
    });

    if (!pr) throw new Error("PR not found");
    if (pr.status !== "OPEN") throw new Error("PR is not open");

    const repoPath = gitServer.getRepoPath(pr.repoId);

    // Perform Git merge
    await new Promise<void>((resolve, reject) => {
      const args =
        method === "squash"
          ? ["merge", "--squash", pr.head]
          : method === "rebase"
            ? ["rebase", pr.head]
            : ["merge", "--no-ff", pr.head];

      const p = spawn("git", args, { cwd: repoPath });
      p.on("close", (code) =>
        code === 0
          ? resolve()
          : reject(new Error(`Merge failed with code ${code}`)),
      );
    });

    // Update PR status
    const updated = await prisma.pullRequest.update({
      where: { id: prId },
      data: {
        status: "MERGED",
        mergedAt: new Date(),
        mergedBy: userId,
      },
      include: { author: true, repo: true },
    });

    console.log(`✅ Merged PR #${pr.number} via ${method}`);
    return updated;
  }

  /**
   * Close PR without merging
   */
  static async closePullRequest(prId: string) {
    const pr = await prisma.pullRequest.update({
      where: { id: prId },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });

    console.log(`🔒 Closed PR #${pr.number}`);
    return pr;
  }

  /**
   * Add review to PR
   */
  static async addReview(
    prId: string,
    reviewerId: string,
    status: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED",
    body?: string,
  ) {
    const review = await prisma.pRReview.create({
      data: {
        pullRequestId: prId,
        reviewerId,
        status,
        body,
      },
      include: {
        reviewer: true,
        pullRequest: true,
      },
    });

    console.log(
      `📝 Review added to PR by ${review.reviewer.username}: ${status}`,
    );
    return review;
  }

  /**
   * Update PR (title, body, draft status)
   */
  static async updatePullRequest(
    prId: string,
    updates: { title?: string; body?: string; draft?: boolean },
  ) {
    return prisma.pullRequest.update({
      where: { id: prId },
      data: updates,
    });
  }
}
