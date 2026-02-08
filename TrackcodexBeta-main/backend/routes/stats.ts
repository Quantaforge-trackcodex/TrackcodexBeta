import { FastifyInstance } from "fastify";
import { contributionStatsService } from "../services/contributionStatsService";

export default async function statsRoutes(fastify: FastifyInstance) {
  // Get contribution graph for a year
  fastify.get("/contributions/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { year } = request.query as { year?: string };

    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    try {
      const contributions = await contributionStatsService.getContributionGraph(
        userId,
        yearNum,
      );
      return { contributions };
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({
        error: "Failed to fetch contribution graph",
        message: error.message,
      });
    }
  });

  // Get commit streak
  fastify.get("/streak/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    try {
      const streak = await contributionStatsService.getStreak(userId);
      return { streak };
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({
        error: "Failed to fetch streak",
        message: error.message,
      });
    }
  });

  // Get total contributions for a year
  fastify.get("/total/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { year } = request.query as { year?: string };

    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    try {
      const total = await contributionStatsService.getTotalContributions(
        userId,
        yearNum,
      );
      return { total, year: yearNum };
    } catch (error: any) {
      request.log.error(error);
      return reply.code(500).send({
        error: "Failed to fetch total contributions",
        message: error.message,
      });
    }
  });
}
