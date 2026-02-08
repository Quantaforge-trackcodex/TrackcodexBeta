import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "./auth";
import { IAMService, RepoLevel } from "../services/iamService";
import { PolicyService, PolicyType } from "../services/policyService";

export { RepoLevel };

const prisma = new PrismaClient();

/**
 * Middleware to require Repository Access/Permission
 * Matches GitHub Enterprise behavior for granular repo permissions and policies.
 */
export function requireRepoPermission(
  requiredLevel: RepoLevel = RepoLevel.READ,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Authentication Check
    await requireAuth(request, reply);
    const user = request.user;
    if (!user) return;

    // 2. Identify Target Repository
    const { id: repoId } = request.params as { id?: string };
    if (!repoId) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "Repository ID required for this route.",
      });
    }

    // 3. Resolve Repository Context
    const repo = await prisma.repository.findUnique({
      where: { id: repoId },
    });

    if (!repo) {
      return reply
        .code(404)
        .send({ error: "Not Found", message: "Repository not found." });
    }

    // 4. Policy Enforcement (Integravity Pillar)
    if (repo.enterpriseId) {
      // Check IP Allowlist
      const ipCheck = await PolicyService.evaluate(
        repo.enterpriseId,
        PolicyType.IP_ALLOWLIST,
        { ip: request.ip },
      );
      if (!ipCheck.allowed) {
        return reply
          .code(403)
          .send({ error: "Forbidden", message: ipCheck.reason });
      }

      // Check 2FA Requirement
      const tfaCheck = await PolicyService.evaluate(
        repo.enterpriseId,
        PolicyType.TWO_FACTOR_REQUIRED,
        { twoFactorEnabled: user.twoFactorEnabled },
      );
      if (!tfaCheck.allowed) {
        return reply
          .code(403)
          .send({ error: "Forbidden", message: tfaCheck.reason });
      }
    }

    // 5. Public Access Bypass (Only AFTER security policies)
    if (repo.isPublic && requiredLevel === RepoLevel.READ) {
      request.enterpriseId = repo.enterpriseId || undefined;
      request.repository = repo;
      return;
    }

    // 6. Evaluate RBAC via Integravity IAM Engine
    const actualLevel = await IAMService.getRepoPermission(
      user.userId,
      repo.id,
    );

    if (!actualLevel && user.role !== "super_admin") {
      return reply.code(403).send({
        error: "Forbidden",
        message: "You do not have permission to access this repository.",
      });
    }

    // 7. Level check
    const levels = [
      RepoLevel.ADMIN,
      RepoLevel.MAINTAIN,
      RepoLevel.WRITE,
      RepoLevel.TRIAGE,
      RepoLevel.READ,
    ];
    const actualIdx = levels.indexOf(actualLevel as RepoLevel);
    const requiredIdx = levels.indexOf(requiredLevel);

    if (actualIdx > requiredIdx && user.role !== "super_admin") {
      return reply.code(403).send({
        error: "Forbidden",
        message: `Insufficient permissions. Required: ${requiredLevel}, Actual: ${actualLevel || "None"}`,
      });
    }

    // 8. Populate Context
    request.repository = repo;
    request.repoPermission = actualLevel || undefined;
    request.enterpriseId = repo.enterpriseId || undefined;
  };
}

/**
 * Middleware to require a specific granular capability
 */
import { hasRepoPermission } from "../../auth/AccessMatrix";
import { RepoPermission } from "../../types";

export function requireRepoCapability(capability: RepoPermission) {
  // Reuse base logic -> in production refactor to shared internal helper
  // For now wrapping requireRepoPermission logic is tricky without code duplication
  // or refactoring the above into a `getRepoContext` helper.

  // Let's refactor the core logic out first?
  // actually, let's just use the existing middleware to get the role, then check capability.
  // BUT existing middleware throws if role check fails.
  // We can use requireRepoPermission(RepoLevel.READ) to ensure *some* access, then check capability.

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Ensure basic READ access and context population
    await requireRepoPermission(RepoLevel.READ)(request, reply);
    if (reply.sent) return;

    const userRole = request.repoPermission as RepoLevel;
    // Cast RepoLevel (enum) to RepoRole (type) - they are now string aligned "ADMIN" | "MAINTAIN" etc.

    if (!userRole) {
      return reply
        .code(403)
        .send({ error: "Forbidden", message: "No repository access" });
    }

    // 2. Check Capability
    // We strictly cast because we aligned the strings in previous step
    const hasCap = hasRepoPermission(userRole as any, capability);

    if (!hasCap) {
      return reply.code(403).send({
        error: "Forbidden",
        message: `Missing capability: ${capability}`,
      });
    }
  };
}
