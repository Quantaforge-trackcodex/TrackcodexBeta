import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Integravity Activity Service
 * Centralized aggregator for collaboration events (GitHub-style activity stream).
 */
export class ActivityService {
  /**
   * Logs a new activity event.
   */
  static async log(data: {
    type: string;
    actorId: string;
    orgId?: string;
    repoId?: string;
    details?: any;
  }) {
    return await prisma.activity.create({
      data: {
        type: data.type,
        actorId: data.actorId,
        orgId: data.orgId,
        repoId: data.repoId,
        details: data.details,
      },
    });
  }

  /**
   * Fetch activity for a specific repository.
   */
  static async getRepoActivity(repoId: string, limit = 20) {
    return await prisma.activity.findMany({
      where: { repoId },
      include: { actor: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Fetch activity for an entire organization.
   */
  static async getOrgActivity(orgId: string, limit = 50) {
    return await prisma.activity.findMany({
      where: { orgId },
      include: { actor: true, repo: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
