import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer";
import { DependencyManager, SecurityVulnerability } from "./dependencyManager";
import { PullRequestService } from "./pullRequestService";
import { SCMService } from "./scmService";
import { SecurityService } from "./securityService";
import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const prisma = new PrismaClient();
const gitServer = new GitServer();

export class DependabotService {
  /**
   * Main entry point to run Dependabot on a repository.
   */
  static async run(repoId: string) {
    console.log(`🤖 [Dependabot]: Starting update cycle for ${repoId}`);

    // 1. Scan for vulnerabilities
    const vulnerabilities = await SecurityService.auditRepoDependencies(repoId);

    // 2. Filter for vulnerabilities with fixes available
    // Note: Our current DependencyManager scanSecurityVulnerabilities provides this.
    // However, auditRepoDependencies in SecurityService creates DB alerts.
    // We'll re-run a scan to get the rich vulnerability data.
    const repoPath = await SCMService.getRepoPath(repoId);
    const tempDir = path.join(process.cwd(), "temp", `dependabot-${repoId}`);

    try {
      // Prepare temp workspace
      if (
        await fs
          .access(tempDir)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
      await fs.mkdir(tempDir, { recursive: true });

      // Clone repo to temp workspace
      await this.spawnGit(["clone", repoPath, "."], tempDir);

      const dm = new DependencyManager();
      const scanResults = await dm.scanSecurityVulnerabilities(tempDir);

      for (const vuln of scanResults) {
        if (vuln.fixAvailable) {
          await this.createFixPullRequest(repoId, tempDir, vuln);
        }
      }
    } finally {
      // Cleanup
      if (
        await fs
          .access(tempDir)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    }
  }

  /**
   * Creates a fix Pull Request for a specific vulnerability.
   */
  private static async createFixPullRequest(
    repoId: string,
    workspacePath: string,
    vulnerability: SecurityVulnerability,
  ) {
    const branchName = `dependabot/npm_and_yarn/${vulnerability.name}-${vulnerability.severity}`;

    console.log(
      `🤖 [Dependabot]: Creating fix for ${vulnerability.name} on branch ${branchName}`,
    );

    try {
      // 1. Create and checkout branch
      await this.spawnGit(["checkout", "-b", branchName], workspacePath);

      // 2. Apply fix
      const dm = new DependencyManager();
      // vulnerability.range usually looks like >=4.0.0 <4.17.2, we need a specific version.
      // For the sake of this implementation, we'll try to update to the latest compatible safe version.
      // DependencyManager's applyFixes handles version setting.
      const fixResult = await dm.applyFixes(workspacePath, [
        { type: "update", package: vulnerability.name, version: "latest" }, // In a real app, we'd pick the specific fix version
      ]);

      if (!fixResult.success) {
        console.error(
          `🤖 [Dependabot]: Failed to apply fix: ${fixResult.message}`,
        );
        return;
      }

      // 3. Commit changes
      await this.spawnGit(
        ["add", "package.json", "package-lock.json"],
        workspacePath,
      );
      await this.spawnGit(
        [
          "commit",
          "-m",
          `Dependabot: Upgrade ${vulnerability.name} to fix security issues`,
        ],
        workspacePath,
      );

      // 4. Push branch back to main repo
      await this.spawnGit(["push", "origin", branchName], workspacePath);

      // 5. Create PR in database
      const systemUser =
        (await prisma.user.findFirst({ where: { username: "dependabot" } })) ||
        (await prisma.user.findFirst()); // Fallback to first user for demo

      await PullRequestService.createPullRequest(
        repoId,
        "main",
        branchName,
        `Dependabot: Upgrade ${vulnerability.name} to fix security issues`,
        `Upgrade ${vulnerability.name} to resolve a ${vulnerability.severity} severity vulnerability.\n\nRange: ${vulnerability.range}\nVia: ${vulnerability.via}`,
        systemUser?.id || "dependabot-id",
      );

      console.log(`🤖 [Dependabot]: PR created for ${vulnerability.name}`);
    } catch (err) {
      console.error(
        `🤖 [Dependabot]: Error fixing ${vulnerability.name}:`,
        err,
      );
    }
  }

  private static spawnGit(args: string[], cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const p = spawn("git", args, { cwd });
      let out = "";
      p.stdout.on("data", (d) => (out += d));
      p.on("close", (code) =>
        code === 0 ? resolve(out) : reject(new Error(`Git exited ${code}`)),
      );
    });
  }
}
