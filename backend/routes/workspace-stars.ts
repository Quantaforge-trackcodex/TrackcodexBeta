import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function workspaceStarsRoutes(fastify: FastifyInstance) {
  // Star a workspace
  fastify.post("/workspaces/:workspaceId/star", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const userId = (request.user as any)?.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    try {
      // Check if workspace exists and is public or owned by user
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: { owner: true },
      });

      if (!workspace) {
        return reply.code(404).send({ error: "Workspace not found" });
      }

      if (workspace.visibility === "private" && workspace.ownerId !== userId) {
        return reply.code(403).send({ error: "Cannot star private workspace" });
      }

      // Check if already starred
      const existingStar = await prisma.workspaceStar.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

      if (existingStar) {
        return reply.code(400).send({ error: "Already starred" });
      }

      // Create star
      await prisma.workspaceStar.create({
        data: {
          userId,
          workspaceId,
        },
      });

      // Increment stars count
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          starsCount: { increment: 1 },
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error starring workspace:", error);
      return reply.code(500).send({ error: "Failed to star workspace" });
    }
  });

  // Unstar a workspace
  fastify.delete("/workspaces/:workspaceId/star", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const userId = (request.user as any)?.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    try {
      const star = await prisma.workspaceStar.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

      if (!star) {
        return reply.code(404).send({ error: "Star not found" });
      }

      // Delete star
      await prisma.workspaceStar.delete({
        where: { id: star.id },
      });

      // Decrement stars count
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          starsCount: { decrement: 1 },
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error unstarring workspace:", error);
      return reply.code(500).send({ error: "Failed to unstar workspace" });
    }
  });

  // Get workspace stargazers
  fastify.get("/workspaces/:workspaceId/stargazers", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const { page = 1, limit = 30 } = request.query as {
      page?: number;
      limit?: number;
    };

    try {
      const stars = await prisma.workspaceStar.findMany({
        where: { workspaceId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      const total = await prisma.workspaceStar.count({
        where: { workspaceId },
      });

      const users = stars.map((star) => ({
        id: star.user.id,
        username: star.user.username,
        name: star.user.name,
        avatarUrl: star.user.avatarUrl,
        bio: star.user.profile?.bio,
        starredAt: star.createdAt,
      }));

      return {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      console.error("Error fetching stargazers:", error);
      return reply.code(500).send({ error: "Failed to fetch stargazers" });
    }
  });

  // Update workspace visibility
  fastify.patch(
    "/workspaces/:workspaceId/visibility",
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const { visibility } = request.body as {
        visibility: "public" | "private";
      };
      const userId = (request.user as any)?.id;

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      if (!["public", "private"].includes(visibility)) {
        return reply.code(400).send({ error: "Invalid visibility value" });
      }

      try {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
        });

        if (!workspace) {
          return reply.code(404).send({ error: "Workspace not found" });
        }

        if (workspace.ownerId !== userId) {
          return reply
            .code(403)
            .send({ error: "Only workspace owner can change visibility" });
        }

        const updated = await prisma.workspace.update({
          where: { id: workspaceId },
          data: { visibility },
        });

        return { success: true, visibility: updated.visibility };
      } catch (error) {
        console.error("Error updating workspace visibility:", error);
        return reply.code(500).send({ error: "Failed to update visibility" });
      }
    },
  );

  // Fork a workspace
  fastify.post("/workspaces/:workspaceId/fork", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const userId = (request.user as any)?.id;

    if (!userId) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    try {
      const originalWorkspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!originalWorkspace) {
        return reply.code(404).send({ error: "Workspace not found" });
      }

      if (
        originalWorkspace.visibility === "private" &&
        originalWorkspace.ownerId !== userId
      ) {
        return reply.code(403).send({ error: "Cannot fork private workspace" });
      }

      // Create fork
      const fork = await prisma.workspace.create({
        data: {
          name: `${originalWorkspace.name} (fork)`,
          description: originalWorkspace.description,
          environment: originalWorkspace.environment,
          runtime: originalWorkspace.runtime,
          repoUrl: originalWorkspace.repoUrl,
          ownerId: userId,
          visibility: "private",
          forkedFrom: workspaceId,
        },
      });

      // Increment forks count on original
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          forksCount: { increment: 1 },
        },
      });

      return {
        success: true,
        fork: {
          id: fork.id,
          name: fork.name,
          description: fork.description,
          forkedFrom: fork.forkedFrom,
        },
      };
    } catch (error) {
      console.error("Error forking workspace:", error);
      return reply.code(500).send({ error: "Failed to fork workspace" });
    }
  });
}
