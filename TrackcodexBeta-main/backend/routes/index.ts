import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth";
import { rateLimiter } from "../middleware/rateLimiter";
import { authOtpRoutes } from "./auth_otp";
import { workspaceRoutes } from "./workspaces";
import { workspaceStarsRoutes } from "./workspace-stars";
import { repositoryRoutes } from "./repositories";
import { jobRoutes } from "./jobs";
import { orgRoutes } from "./organizations";
import { communityRoutes } from "./community";
import { profileRoutes } from "./profile";
import { userRoutes } from "./users";
import { forgeRoutes } from "./forge";
import { notificationRoutes } from "./notifications";
import { adminRoutes } from "./admin";
import { searchRoutes } from "./search"; // Global Search
import { ChatService } from "../services/chat";
import { RealtimeService } from "../services/realtime";
import { workspaceCollaborationRoutes } from "./workspace-collaboration";
import { fileRoutes } from "./files";
import { TerminalService } from "../services/terminal";

import { enterpriseRoutes } from "./enterprise";
import { collaborationRoutes } from "./collaboration";
import { executionRoutes } from "./execution";
import { securityRoutes } from "./security";
import { webhookRoutes } from "./webhooks";
import { activityRoutes } from "./activity";
import { teamRoutes } from "./teams";
import { insightsRoutes } from "./insights";
import { wikiRoutes } from "./wiki";

import { messageRoutes } from "./messages";
import portfolioRoutes from "./portfolio";
import statsRoutes from "./stats";

export async function routes(fastify: FastifyInstance) {
  // Middleware - DISABLED FOR DEBUGGING
  // fastify.addHook("preHandler", rateLimiter());

  fastify.addHook("onRequest", async (request) => {
    console.log(
      `[DEBUG] Incoming Request: ${request.method} ${request.url} from ${request.ip}`,
    );
  });

  fastify.get("/", async () => {
    return {
      status: "ok",
      message: "TrackCodex Backend API v2 (/api/v1 registered)",
    };
  });

  await fastify.register(authRoutes);
  await fastify.register(authOtpRoutes);
  await fastify.register(notificationRoutes); // NEW
  await fastify.register(workspaceRoutes);
  await fastify.register(repositoryRoutes);
  await fastify.register(jobRoutes);
  await fastify.register(orgRoutes);
  await fastify.register(communityRoutes);
  await fastify.register(profileRoutes);
  await fastify.register(forgeRoutes);
  await fastify.register(adminRoutes);
  await fastify.register(searchRoutes);
  await fastify.register(workspaceCollaborationRoutes);
  await fastify.register(fileRoutes);
  await fastify.register(enterpriseRoutes, { prefix: "/enterprises" });
  await fastify.register(collaborationRoutes);
  await fastify.register(executionRoutes);
  // await fastify.register(securityRoutes);
  await fastify.register(webhookRoutes);
  await fastify.register(activityRoutes);
  await fastify.register(teamRoutes);
  await fastify.register(insightsRoutes);
  await fastify.register(wikiRoutes);
  await fastify.register(userRoutes);
  await fastify.register(portfolioRoutes, { prefix: "/portfolio" });
  await fastify.register(statsRoutes, { prefix: "/stats" });

  await fastify.register(messageRoutes);

  const { default: deploymentRoutes } = await import("./deployments");
  await fastify.register(deploymentRoutes);
}
