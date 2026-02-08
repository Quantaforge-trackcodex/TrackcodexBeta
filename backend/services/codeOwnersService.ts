import { PrismaClient } from "@prisma/client";
import { GitServer } from "./git/gitServer.js";
import { minimatch } from "minimatch";
import fs from "fs";

const prisma = new PrismaClient();
const gitServer = new GitServer();

interface CodeOwnerRule {
  pattern: string;
  owners: string[];
}

export class CodeOwnersService {
  /**
   * Parses the CODEOWNERS file content into structured rules.
   */
  static parseCodeOwners(content: string): CodeOwnerRule[] {
    const lines = content.split("\n");
    const rules: CodeOwnerRule[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const pattern = parts[0];
        const owners = parts.slice(1).map((o) => o.replace(/^@/, ""));
        rules.push({ pattern, owners });
      }
    }

    return rules;
  }

  /**
   * Finds the CODEOWNERS file in common locations.
   */
  static async findCodeOwnersFile(repoId: string): Promise<string | null> {
    const repoPath = gitServer.getRepoPath(repoId);
    const locations = ["CODEOWNERS", ".github/CODEOWNERS", "docs/CODEOWNERS"];

    // For a standalone engine, we check the 'main' or default branch files.
    // In our simplified GitServer, we can use isomorphic-git to read the file.
    try {
      const { WorkflowService } = await import("./workflowService.js");
      // This is a bit of a shortcut. In production, we'd read from the specific ref.
      for (const loc of locations) {
        try {
          // Attempt to read via gitServer (isomorphic-git)
          const files = await gitServer.listFiles(repoId);
          if (files.includes(loc)) {
            // Read content
            // For now, we'll use a git cat-file style approach or readObject
            // But listFiles + getFileContent is better.
            // Simplified for MVP: read from HEAD
            const log = await (gitServer as any).spawnGit(
              ["show", `HEAD:${loc}`],
              repoPath,
            );
            return log;
          }
        } catch (e) {
          // File likely doesn't exist at this location
        }
      }
    } catch (e) {
      console.error("Error finding CODEOWNERS", e);
    }

    return null;
  }

  /**
   * Applies CODEOWNERS rules to a Pull Request.
   */
  static async applyCodeOwnersToPR(
    repoId: string,
    pullRequestId: string,
    changedFiles: string[],
  ) {
    console.log(
      `🛡️ [CodeOwners] Applying governance to PR #${pullRequestId} in ${repoId}...`,
    );

    const content = await this.findCodeOwnersFile(repoId);
    if (!content) {
      console.log(`ℹ️ [CodeOwners] No CODEOWNERS file found for ${repoId}.`);
      return;
    }

    const rules = this.parseCodeOwners(content);
    const assignedOwners = new Set<string>();

    for (const file of changedFiles) {
      // CODEOWNERS patterns often look like /path/to/dir/ or glob
      // We use minimatch for standard glob support.
      for (const rule of rules) {
        let pattern = rule.pattern;
        // GitHub specific: if pattern starts with /, it's relative to root
        // minimatch handles root-relative well if we treat it carefully.
        if (minimatch(file, pattern, { dot: true, matchBase: true })) {
          rule.owners.forEach((owner) => assignedOwners.add(owner));
        }
      }
    }

    if (assignedOwners.size === 0) return;

    console.log(
      `👥 [CodeOwners] Identified owners: ${Array.from(assignedOwners).join(", ")}`,
    );

    // Assign reviewers in DB
    for (const username of assignedOwners) {
      try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
          // Check if already a reviewer
          const existing = await prisma.pRReview.findFirst({
            where: {
              pullRequestId,
              reviewerId: user.id,
            },
          });

          if (!existing) {
            await prisma.pRReview.create({
              data: {
                pullRequestId,
                reviewerId: user.id,
                status: "PENDING", // Unified status for requested reviews
                body: "Automatically assigned via CODEOWNERS governance.",
              },
            });
            console.log(`✅ [CodeOwners] Assigned @${username} to PR.`);
          }
        } else {
          console.warn(
            `⚠️ [CodeOwners] User @${username} not found in database.`,
          );
        }
      } catch (e) {
        console.error(`❌ [CodeOwners] Failed to assign @${username}`, e);
      }
    }
  }
}
