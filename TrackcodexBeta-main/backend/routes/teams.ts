import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth, requireOrgRole } from "../middleware/auth"; // We might need to implement requireOrgRole
import { AuditService } from "../services/audit";
import { AppError, BadRequest, NotFound, Forbidden } from "../utils/AppError";
import { TeamRole, OrgRole } from "../types";

const prisma = new PrismaClient();

/**
 * Team Management Routes
 * Implements GitHub-style team hierarchy and permission inheritance.
 */
export async function teamRoutes(fastify: FastifyInstance) {
  // Create Team in Organization
  fastify.post(
    "/orgs/:orgId/teams",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { orgId } = request.params as { orgId: string };
      const { name, description, privacy } = request.body as {
        name: string;
        description?: string;
        privacy?: string;
      };
      const user = request.user;

      // Verify Org Admin/Owner
      // TODO: Use real middleware
      // For now check valid member

      const team = await prisma.team.create({
        data: {
          name,
          description,
          organizationId: orgId,
          members: {
            create: {
              userId: user!.userId,
              role: "MAINTAINER",
            },
          },
        },
      });

      await AuditService.log({
        actorId: user!.userId,
        action: "TEAM_CREATE",
        resource: `org:${orgId}/team:${team.id}`,
        details: { name },
        ipAddress: request.ip,
      });

      return team;
    },
  );

  // Add Member to Team
  fastify.post(
    "/teams/:teamId/members",
    { preHandler: requireAuth },
    async (request) => {
      const { teamId } = request.params as { teamId: string };
      const { userId, role } = request.body as {
        userId: string;
        role?: TeamRole;
      };

      const teamMember = await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role: role || "MEMBER",
        },
      });

      return teamMember;
    },
  );

  // List Teams for Org
  fastify.get(
    "/orgs/:orgId/teams",
    { preHandler: requireAuth },
    async (request) => {
      const { orgId } = request.params as { orgId: string };
      return await prisma.team.findMany({
        where: { organizationId: orgId },
        include: { _count: { select: { members: true, repos: true } } },
      });
    },
  );
}
