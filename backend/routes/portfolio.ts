import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PortfolioService } from "../services/portfolioService";
import { requireAuth } from "../middleware/auth";

interface CreatePortfolioBody {
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
  technologies: string[];
}

export default async function (server: FastifyInstance) {
  /**
   * Create Portfolio Item
   * POST /api/v1/portfolio
   */
  server.post<{ Body: CreatePortfolioBody }>(
    "/",
    { preHandler: requireAuth },
    async (req, reply) => {
      const currentUser = (req as any).user;
      const { title, description, imageUrl, demoUrl, sourceUrl, technologies } =
        req.body;

      if (!title || !description) {
        return reply
          .status(400)
          .send({ error: "Title and description are required" });
      }

      try {
        const result = await PortfolioService.createPortfolioItem(
          currentUser.id,
          {
            title,
            description,
            imageUrl,
            demoUrl,
            sourceUrl,
            technologies: technologies || [],
          },
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          item: result.item,
          message: "Portfolio item created successfully",
        });
      } catch (error) {
        console.error("Create portfolio item error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to create portfolio item" });
      }
    },
  );

  /**
   * Get User's Portfolio Items
   * GET /api/v1/portfolio/:userId
   */
  server.get<{ Params: { userId: string } }>(
    "/:userId",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;

      try {
        const result = await PortfolioService.getUserPortfolioItems(userId);

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          items: result.items || [],
        });
      } catch (error) {
        console.error("Get portfolio items error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to fetch portfolio items" });
      }
    },
  );

  /**
   * Update Portfolio Item
   * PUT /api/v1/portfolio/:itemId
   */
  server.put<{ Params: { itemId: string }; Body: CreatePortfolioBody }>(
    "/:itemId",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{ Params: { itemId: string }; Body: any }>,
      reply: FastifyReply,
    ) => {
      const { itemId } = req.params;
      const currentUser = (req as any).user;
      const { title, description, imageUrl, demoUrl, sourceUrl, technologies } =
        req.body;

      try {
        const result = await PortfolioService.updatePortfolioItem(
          itemId,
          currentUser.id,
          {
            title,
            description,
            imageUrl,
            demoUrl,
            sourceUrl,
            technologies,
          },
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          item: result.item,
          message: "Portfolio item updated successfully",
        });
      } catch (error) {
        console.error("Update portfolio item error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to update portfolio item" });
      }
    },
  );

  /**
   * Delete Portfolio Item
   * DELETE /api/v1/portfolio/:itemId
   */
  server.delete<{ Params: { itemId: string } }>(
    "/:itemId",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{ Params: { itemId: string } }>,
      reply: FastifyReply,
    ) => {
      const { itemId } = req.params;
      const currentUser = (req as any).user;

      try {
        const result = await PortfolioService.deletePortfolioItem(
          itemId,
          currentUser.id,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Portfolio item deleted successfully",
        });
      } catch (error) {
        console.error("Delete portfolio item error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to delete portfolio item" });
      }
    },
  );

  /**
   * Reorder Portfolio Items
   * PATCH /api/v1/portfolio/:userId/reorder
   */
  server.patch<{ Params: { userId: string }; Body: { itemIds: string[] } }>(
    "/:userId/reorder",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{
        Params: { userId: string };
        Body: { itemIds: string[] };
      }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const { itemIds } = req.body;
      const currentUser = (req as any).user;

      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      try {
        const result = await PortfolioService.reorderPortfolioItems(
          userId,
          itemIds,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Portfolio items reordered successfully",
        });
      } catch (error) {
        console.error("Reorder portfolio items error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to reorder portfolio items" });
      }
    },
  );

  /**
   * Toggle Featured Status
   * PATCH /api/v1/portfolio/:itemId/feature
   */
  server.patch<{ Params: { itemId: string }; Body: { featured: boolean } }>(
    "/:itemId/feature",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{
        Params: { itemId: string };
        Body: { featured: boolean };
      }>,
      reply: FastifyReply,
    ) => {
      const { itemId } = req.params;
      const { featured } = req.body;
      const currentUser = (req as any).user;

      try {
        const result = await PortfolioService.toggleFeatured(
          itemId,
          currentUser.id,
          featured,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: `Portfolio item ${featured ? "pinned" : "unpinned"} successfully`,
        });
      } catch (error) {
        console.error("Toggle featured error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to toggle featured status" });
      }
    },
  );

  /**
   * Update Visibility Settings
   * PATCH /api/v1/portfolio/:userId/visibility
   */
  server.patch<{
    Params: { userId: string };
    Body: {
      showPortfolio?: boolean;
      showRepositories?: boolean;
      showContributions?: boolean;
    };
  }>(
    "/:userId/visibility",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{
        Params: { userId: string };
        Body: {
          showPortfolio?: boolean;
          showRepositories?: boolean;
          showContributions?: boolean;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const { showPortfolio, showRepositories, showContributions } = req.body;
      const currentUser = (req as any).user;

      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      try {
        const result = await PortfolioService.updateVisibility(
          userId,
          showPortfolio,
          showRepositories,
          showContributions,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Visibility settings updated successfully",
        });
      } catch (error) {
        console.error("Update visibility error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to update visibility settings" });
      }
    },
  );
}
