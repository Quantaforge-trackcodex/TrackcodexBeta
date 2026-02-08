import { FastifyInstance } from "fastify";
import { RunnerService } from "../services/runnerService";
import { WorkflowService } from "../services/workflowService";
import { requireEnterpriseMember } from "../middleware/enterpriseAuth";

/**
 * Execution API: Runner Control Plane
 * Provides endpoints for self-hosted runners to interact with TrackCodex CI/CD.
 */
export async function executionRoutes(fastify: FastifyInstance) {
  // --- Runner Management ---

  // Register Runner
  fastify.post(
    "/execution/runners/register",
    { preHandler: requireEnterpriseMember() }, // Requires enterprise context
    async (request, reply) => {
      const { runnerGroupId, name, os, arch, labels, version } =
        request.body as any;
      const runner = await RunnerService.registerRunner({
        runnerGroupId,
        name,
        os,
        arch,
        labels,
        version,
      });
      return reply.code(201).send(runner);
    },
  );

  // Runner Heartbeat
  fastify.post("/execution/runners/:id/heartbeat", async (request) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as {
      status: "ONLINE" | "BUSY" | "OFFLINE";
    };
    return await RunnerService.updateHeartbeat(id, status);
  });

  // --- Job Execution ---

  // Fetch Available Jobs (Poll-based for self-hosted runners)
  fastify.get("/execution/jobs/fetch", async (request) => {
    const { labels } = request.query as { labels?: string };
    const labelList = labels ? labels.split(",") : [];
    return await WorkflowService.fetchAvailableJobs(labelList);
  });

  // Accept Job
  fastify.post("/execution/jobs/:id/accept", async (request) => {
    const { id: jobId } = request.params as { id: string };
    const { runnerId } = request.body as { runnerId: string };
    return await RunnerService.assignJob(jobId, runnerId);
  });

  // Complete Job & Upload Logs
  fastify.post("/execution/jobs/:id/complete", async (request) => {
    const { id: jobId } = request.params as { id: string };
    const { conclusion, logs, steps } = request.body as {
      conclusion: string;
      logs: string;
      steps?: any;
    };
    return await RunnerService.completeJob(jobId, { conclusion, logs, steps });
  });
}
