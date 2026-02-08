import { FastifyInstance, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { requireEnterpriseMember } from "../middleware/enterpriseAuth";
import { EnterpriseService } from "../services/enterpriseService";
import { EnterpriseRole } from "../services/iamService";
import { AuditService } from "../services/audit";

const prisma = new PrismaClient();

/**
 * Enterprise Routes (GitHub Parity)
 * Implements production-grade RBAC and immutable audit logging.
 */
export async function enterpriseRoutes(fastify: FastifyInstance) {
  // GET /enterprises - List My Enterprises
  fastify.get("/", { preHandler: requireAuth }, async (request, reply) => {
    const user = request.user;
    if (!user) return reply.code(401).send({ error: "Unauthorized" });

    try {
      const enterprises = await EnterpriseService.getUserEnterprises(
        user.userId,
      );
      return reply.send(enterprises);
    } catch (e: any) {
      return reply.code(500).send({ error: e.message });
    }
  });

  // POST /enterprises - Create new Enterprise
  fastify.post("/", { preHandler: requireAuth }, async (request, reply) => {
    const user = request.user;
    if (!user) return reply.code(401).send({ error: "Unauthorized" });

    const { name, slug } = request.body as { name: string; slug: string };

    try {
      const enterprise = await EnterpriseService.createEnterprise(user.userId, {
        name,
        slug,
      });

      // Audit Log for Enterprise Creation
      await prisma.auditLog.create({
        data: {
          enterpriseId: enterprise.id,
          actorId: user.userId,
          action: "ENTERPRISE_CREATE",
          resource: `enterprise:${enterprise.id}`,
          details: { name, slug },
          ipAddress: request.ip,
        },
      });

      return reply.send(enterprise);
    } catch (e: any) {
      if (e.code === "P2002") {
        return reply.code(409).send({ error: "Slug already exists" });
      }
      return reply.code(500).send({ error: e.message });
    }
  });

  // GET /enterprises/:slug - Get Details
  fastify.get(
    "/:slug",
    { preHandler: requireEnterpriseMember() }, // Any member can view public enterprise info
    async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const enterprise = await EnterpriseService.getBySlug(slug);
      if (!enterprise) {
        return reply.code(404).send({ message: "Enterprise not found" });
      }
      return enterprise;
    },
  );

  // POST /enterprises/:slug/members - Invite Member
  fastify.post(
    "/:slug/members",
    { preHandler: requireEnterpriseMember([EnterpriseRole.OWNER]) }, // Only OWNER can invite
    async (request, reply) => {
      const { slug } = request.params as { slug: string };
      const { userId, role } = request.body as { userId: string; role: string };
      const actor = request.user;
      const enterprise = request.enterprise;

      if (!actor || !enterprise)
        return reply.code(500).send({ error: "Context lost" });

      try {
        const member = await EnterpriseService.addMember(slug, userId, role);

        // Audit Log for Member Addition
        await prisma.auditLog.create({
          data: {
            enterpriseId: enterprise.id,
            actorId: actor.userId,
            action: "MEMBER_ADD",
            resource: `user:${userId}`,
            details: { role },
            ipAddress: request.ip,
          },
        });

        return reply.send(member);
      } catch (e: any) {
        return reply.code(400).send({ error: e.message });
      }
    },
  );

  // DELETE /enterprises/:slug/members/:userId - Remove Member
  fastify.delete(
    "/:slug/members/:userId",
    { preHandler: requireEnterpriseMember([EnterpriseRole.OWNER]) },
    async (request, reply) => {
      const { slug, userId } = request.params as {
        slug: string;
        userId: string;
      };
      const actor = request.user;
      const enterprise = request.enterprise;

      if (!actor || !enterprise)
        return reply.code(500).send({ error: "Context lost" });

      try {
        await EnterpriseService.removeMember(slug, userId);

        // Audit Log for Member Removal
        await prisma.auditLog.create({
          data: {
            enterpriseId: enterprise.id,
            actorId: actor.userId,
            action: "MEMBER_REMOVE",
            resource: `user:${userId}`,
            details: {},
            ipAddress: request.ip,
          },
        });

        return reply.code(204).send();
      } catch (e: any) {
        return reply.code(400).send({ error: e.message });
      }
    },
  );

  // GET /enterprises/:slug/members - List Members
  fastify.get(
    "/:slug/members",
    { preHandler: requireEnterpriseMember() },
    async (request) => {
      const { slug } = request.params as { slug: string };
      const members = await EnterpriseService.getMembers(slug);
      return { members };
    },
  );

  // PATCH /enterprises/:slug/members/:userId - Update Member Role
  fastify.patch(
    "/:slug/members/:userId",
    { preHandler: requireEnterpriseMember([EnterpriseRole.OWNER]) },
    async (request, reply) => {
      const { slug, userId } = request.params as {
        slug: string;
        userId: string;
      };
      const { role } = request.body as { role: string };
      const actor = request.user;
      const enterprise = request.enterprise;

      if (!actor || !enterprise)
        return reply.code(500).send({ error: "Context lost" });

      try {
        const updated = await EnterpriseService.updateMemberRole(
          slug,
          userId,
          role,
        );

        // Audit Log for Role Change
        await prisma.auditLog.create({
          data: {
            enterpriseId: enterprise.id,
            actorId: actor.userId,
            action: "MEMBER_ROLE_UPDATE",
            resource: `user:${userId}`,
            details: { role },
            ipAddress: request.ip,
          },
        });

        return reply.send(updated);
      } catch (e: any) {
        return reply.code(400).send({ error: e.message });
      }
    },
  );
}
