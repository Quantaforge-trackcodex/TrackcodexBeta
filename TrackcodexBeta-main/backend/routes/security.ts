import { FastifyInstance } from "fastify";
import { SecurityService } from "../services/securityService";
import { requireRepoPermission, RepoLevel } from "../middleware/repoAuth";

/**
 * Security API: Vulnerability Management
 * Provides endpoints for managing repository security alerts and scans.
 */
export async function securityRoutes(fastify: FastifyInstance) {
  // List Security Alerts
  fastify.get(
    "/repositories/:id/security/alerts",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await SecurityService.getAlerts(repoId);
    },
  );

  // Trigger Manual Scan
  fastify.post(
    "/repositories/:id/security/scan",
    { preHandler: requireRepoPermission(RepoLevel.ADMIN) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await SecurityService.performFullScan(repoId);
    },
  );

  // Update Alert Status
  fastify.patch(
    "/security/alerts/:alertId",
    { preHandler: requireRepoPermission(RepoLevel.WRITE) }, // Note: Needs proper route params logic
    async (request) => {
      const { alertId } = request.params as { alertId: string };
      const { status } = request.body as { status: "DISMISSED" | "FIXED" };
      return await SecurityService.updateAlertStatus(alertId, status);
    },
  );
}
