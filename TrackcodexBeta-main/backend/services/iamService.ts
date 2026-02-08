import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Integravity IAM Service: Hierarchical RBAC and Permission Engine
 * Matches GitHub Enterprise behavior for nested permissions.
 */

export enum EnterpriseRole {
  OWNER = "OWNER",
  BILLING_MANAGER = "BILLING_MANAGER",
}

export enum OrgRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
  BILLING_MANAGER = "BILLING_MANAGER",
}

export enum TeamRole {
  MAINTAINER = "MAINTAINER",
  MEMBER = "MEMBER",
}

export enum RepoLevel {
  ADMIN = "ADMIN",
  MAINTAIN = "MAINTAIN",
  WRITE = "WRITE",
  TRIAGE = "TRIAGE",
  READ = "READ",
}

export class IAMService {
  /**
   * Check if a user has a specific role in an enterprise.
   */
  static async hasEnterpriseRole(
    userId: string,
    enterpriseId: string,
    roles: EnterpriseRole[],
  ) {
    const member = await prisma.enterpriseMember.findUnique({
      where: {
        enterpriseId_userId: { enterpriseId, userId },
      },
    });

    return member && roles.includes(member.role as EnterpriseRole);
  }

  /**
   * Check if a user has a specific role in an organization.
   * Note: Enterprise Owners automatically inherit Org Admin (Owner) rights.
   */
  static async hasOrgRole(userId: string, orgId: string, roles: OrgRole[]) {
    // 1. Direct Org Membership
    const member = await prisma.orgMember.findUnique({
      where: {
        orgId_userId: { orgId, userId },
      },
    });

    if (member && roles.includes(member.role as OrgRole)) return true;

    // 2. Inheritance from Enterprise
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { enterpriseId: true },
    });

    if (org?.enterpriseId) {
      if (
        await this.hasEnterpriseRole(userId, org.enterpriseId, [
          EnterpriseRole.OWNER,
        ])
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Evaluate Repository Permissions.
   * Logic: User -> Team(s) -> Repo.
   */
  static async getRepoPermission(
    userId: string,
    repoId: string,
  ): Promise<RepoLevel | null> {
    // 1. Direct Repo Access (Not implemented in schema yet, but logic placeholder)

    // 2. Team Membership Access
    const teamPermissions = await prisma.repoPermission.findMany({
      where: {
        repoId,
        team: {
          members: {
            some: { userId },
          },
        },
      },
    });

    if (teamPermissions.length > 0) {
      // Return highest permission level
      const order = [
        RepoLevel.ADMIN,
        RepoLevel.MAINTAIN,
        RepoLevel.WRITE,
        RepoLevel.TRIAGE,
        RepoLevel.READ,
      ];
      for (const level of order) {
        if (teamPermissions.some((p) => p.level === level)) return level;
      }
    }

    // 3. Org Owner Inheritance
    const repo = await prisma.repository.findUnique({
      where: { id: repoId },
      select: { orgId: true },
    });

    if (repo?.orgId) {
      if (await this.hasOrgRole(userId, repo.orgId, [OrgRole.OWNER])) {
        return RepoLevel.ADMIN;
      }
    }

    return null;
  }
}
