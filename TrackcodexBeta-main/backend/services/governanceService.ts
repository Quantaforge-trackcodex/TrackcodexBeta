import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Integravity Governance Service: Branch Protection & Protection Enforcement
 * Matches GitHub Enterprise behavior for repository governance.
 */

export class GovernanceService {
  /**
   * Check if a branch is protected and return the applicable rule.
   */
  static async getBranchProtection(repoId: string, branchName: string) {
    // Exact match or wildcard? GitHub supports glob patterns generally.
    // For MVP, we'll do exact and then check for '*' as a fallback.
    const protections = await prisma.branchProtection.findMany({
      where: { repoId },
    });

    // Check exact first
    const exact = protections.find((p) => p.pattern === branchName);
    if (exact) return exact;

    // Check glob patterns (Simple implementation: e.g. "release/*")
    return protections.find((p) => {
      if (p.pattern.endsWith("*")) {
        const prefix = p.pattern.slice(0, -1);
        return branchName.startsWith(prefix);
      }
      return false;
    });
  }

  /**
   * Validate if a push/commit is allowed on a branch.
   */
  static async validatePush(
    repoId: string,
    branchName: string,
    config: { isSigned: boolean },
  ) {
    const protection = await this.getBranchProtection(repoId, branchName);
    if (!protection) return { allowed: true };

    if (protection.requireSignedCommits && !config.isSigned) {
      return {
        allowed: false,
        reason: "Commit signature required by branch protection rules.",
      };
    }

    return { allowed: true };
  }

  /**
   * Record a status check for a commit.
   */
  static async recordStatusCheck(data: {
    repoId: string;
    commitSha: string;
    context: string;
    state: "PENDING" | "SUCCESS" | "FAILURE" | "ERROR";
    targetUrl?: string;
    description?: string;
  }) {
    return await prisma.statusCheck.upsert({
      where: {
        repoId_commitSha_context: {
          repoId: data.repoId,
          commitSha: data.commitSha,
          context: data.context,
        },
      },
      update: {
        state: data.state,
        targetUrl: data.targetUrl,
        description: data.description,
      },
      create: {
        repoId: data.repoId,
        commitSha: data.commitSha,
        context: data.context,
        state: data.state,
        targetUrl: data.targetUrl,
        description: data.description,
      },
    });
  }

  /**
   * Check if all required status checks are passing for a commit.
   */
  static async areStatusChecksPassing(repoId: string, commitSha: string) {
    const protection = await prisma.branchProtection.findFirst({
      where: { repoId, requireStatusChecks: true },
    });

    if (!protection) return true;

    const checks = await prisma.statusCheck.findMany({
      where: { repoId, commitSha },
    });

    // In a real system, we'd compare against a 'required' list of contexts.
    // For now, if ANY check is not SUCCESS, it's failed.
    return checks.every((c) => c.state === "SUCCESS");
  }
}
