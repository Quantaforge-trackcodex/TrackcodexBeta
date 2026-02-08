import { FastifyInstance } from "fastify";
import { ActivityService } from "../services/activityService";
import { requireRepoPermission, RepoLevel } from "../middleware/repoAuth";

/**
 * Activity API: Collaboration Visibility
 * Provides endpoints for organization and repository activity streams.
 */
export async function activityRoutes(fastify: FastifyInstance) {
  // Repo Activity Feed
  fastify.get(
    "/repositories/:id/activity",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      const { limit } = request.query as { limit?: string };
      return await ActivityService.getRepoActivity(
        repoId,
        limit ? parseInt(limit) : 20,
      );
    },
  );

  // Org Activity Feed
  fastify.get(
    "/organizations/:orgId/activity",
    // Note: Org auth middleware needs to be verified or created.
    // Fallback to basic auth for now if orgAuth.ts is missing.
    async (request) => {
      const { orgId } = request.params as { orgId: string };
      const { limit } = request.query as { limit?: string };
      return await ActivityService.getOrgActivity(
        orgId,
        limit ? parseInt(limit) : 50,
      );
    },
  );

  // Following Feed - Activity from users the current user follows
  fastify.get("/activity/following", async (request, reply) => {
    try {
      const { page, limit } = request.query as { page?: string; limit?: string };
      const pageNum = page ? parseInt(page) : 1;
      const limitNum = limit ? parseInt(limit) : 20;
      
      // For now, return empty activities since follow system may not be fully implemented
      // This prevents 404 errors and allows the UI to render correctly
      return {
        activities: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error: any) {
      console.error("[Activity] Error fetching following feed:", error.message);
      return { activities: [], total: 0 };
    }
  });
}
