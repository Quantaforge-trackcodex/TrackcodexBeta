import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "./auth";
import { IAMService, EnterpriseRole } from "../services/iamService";
import { PolicyService, PolicyType } from "../services/policyService";

const prisma = new PrismaClient();

/**
 * Middleware to require Enterprise Membership/Role
 * Matches GitHub Enterprise behavior: hierarchy, inheritance, and policy enforcement.
 */
export function requireEnterpriseMember(requiredRoles: EnterpriseRole[] = []) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Authentication Check
    await requireAuth(request, reply);
    const user = request.user;
    if (!user) return; // Flow terminated by requireAuth

    // 2. Identify Target Enterprise
    const { slug } = request.params as { slug?: string };
    if (!slug) {
      return reply.code(400).send({
        error: "Bad Request",
        message: "Enterprise context (slug) required for this route.",
      });
    }

    // 3. Resolve Enterprise Context
    const enterprise = await prisma.enterprise.findUnique({
      where: { slug },
    });

    console.log(
      `[DEBUG] enterpriseAuth: Looking for slug='${slug}' -> Found: ${!!enterprise}`,
    );

    if (!enterprise) {
      console.log(
        `[DEBUG] enterpriseAuth: Enterprise not found for slug='${slug}'. Database URL: ${process.env.DATABASE_URL}`,
      );
      return reply.code(404).send({
        error: "Not Found",
        message: `Enterprise record not found for slug: '${slug}'`,
      });
    }

    // 4. Policy Enforcement (Integravity Pillar)
    // Check IP Allowlist
    const ipCheck = await PolicyService.evaluate(
      enterprise.id,
      PolicyType.IP_ALLOWLIST,
      { ip: request.ip },
    );
    if (!ipCheck.allowed) {
      return reply
        .code(403)
        .send({ error: "Forbidden", message: ipCheck.reason });
    }

    // Check 2FA Requirement
    if (enterprise.twoFactorRequired) {
      const tfaCheck = await PolicyService.evaluate(
        enterprise.id,
        PolicyType.TWO_FACTOR_REQUIRED,
        { twoFactorEnabled: user.twoFactorEnabled },
      );
      if (!tfaCheck.allowed) {
        return reply
          .code(403)
          .send({ error: "Forbidden", message: tfaCheck.reason });
      }
    }

    // 5. Evaluate RBAC via Integravity IAM Engine
    const membership = await prisma.enterpriseMember.findUnique({
      where: {
        enterpriseId_userId: {
          enterpriseId: enterprise.id,
          userId: user.userId,
        },
      },
    });

    console.log(
      `[DEBUG] enterpriseAuth: Checking member user='${user.userId}' ent='${enterprise.id}' -> Found: ${!!membership}`,
    );

    if (!membership && user.role !== "super_admin") {
      console.log(`[DEBUG] enterpriseAuth: Access Denied. Not a member.`);
      return reply.code(403).send({
        error: "Forbidden",
        message: "Access restricted to authenticated enterprise members.",
      });
    }

    // 6. Enforce Specific Role Constraints
    if (requiredRoles.length > 0) {
      const hasRole = await IAMService.hasEnterpriseRole(
        user.userId,
        enterprise.id,
        requiredRoles,
      );

      if (!hasRole && user.role !== "super_admin") {
        return reply.code(403).send({
          error: "Forbidden",
          message: `Insufficient Enterprise permissions. Requires: ${requiredRoles.join(", ")}`,
        });
      }
    }

    // 7. Populate Context for Downstream Handlers
    request.enterprise = enterprise;
    request.enterpriseMember = membership || undefined;
    request.enterpriseId = enterprise.id;
  };
}
