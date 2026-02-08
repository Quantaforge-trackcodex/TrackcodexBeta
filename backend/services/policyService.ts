import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Integravity Policy Service: Centralized Governance Engine
 * Matches GitHub Enterprise behavior for policy enforcement.
 */

export enum PolicyType {
  IP_ALLOWLIST = "IP_ALLOWLIST",
  REPO_VISIBILITY = "REPO_VISIBILITY",
  TWO_FACTOR_REQUIRED = "TWO_FACTOR_REQUIRED",
  LICENSE_CHECK = "LICENSE_CHECK",
}

export class PolicyService {
  /**
   * Evaluate if a specific action is allowed under the enterprise policies.
   */
  static async evaluate(
    enterpriseId: string,
    type: PolicyType,
    context: any,
  ): Promise<{ allowed: boolean; reason?: string }> {
    const policies = await prisma.policy.findMany({
      where: { enterpriseId, type, enforced: true },
    });

    for (const policy of policies) {
      const config = (policy.config as any) || {};

      switch (type) {
        case PolicyType.IP_ALLOWLIST:
          // Implement CIDR check logic here
          if (
            config.allowed_cidrs &&
            !this.isIpInCidr(context.ip, config.allowed_cidrs)
          ) {
            return {
              allowed: false,
              reason: "Access restricted by IP allowlist policy.",
            };
          }
          break;

        case PolicyType.REPO_VISIBILITY:
          if (config.restricted_visibility && context.visibility === "PUBLIC") {
            return {
              allowed: false,
              reason: "Enterprise policy forbids public repositories.",
            };
          }
          break;

        case PolicyType.TWO_FACTOR_REQUIRED:
          if (config.required && !context.twoFactorEnabled) {
            return {
              allowed: false,
              reason:
                "Two-factor authentication is required by enterprise policy.",
            };
          }
          break;
      }
    }

    return { allowed: true };
  }

  /**
   * IP CIDR Matching Helper
   */
  private static isIpInCidr(ip: string, cidrs: string[]): boolean {
    // Simple mock for now, implement real CIDR logic in production
    return cidrs.includes(ip) || cidrs.includes("0.0.0.0/0");
  }
}
