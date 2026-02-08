import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function deploymentRoutes(fastify: FastifyInstance) {
  /**
   * Submit an approval/rejection for a deployment.
   */
  fastify.post("/deployments/:id/approve", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, comment, userId } = request.body as {
      status: "APPROVED" | "REJECTED";
      comment?: string;
      userId: string;
    };

    try {
      const deployment = await prisma.deployment.findUnique({
        where: { id },
        include: {
          environment: { include: { reviewers: true } },
          workflowRun: true,
        },
      });

      if (!deployment) {
        return reply.status(404).send({ error: "Deployment not found" });
      }

      // 1. Check if user is an authorized reviewer
      const isReviewer = deployment.environment.reviewers.some(
        (r) => r.userId === userId,
      );
      // In a real app, we'd check team memberships too.
      if (!isReviewer) {
        return reply
          .status(403)
          .send({
            error: "You are not an authorized reviewer for this environment",
          });
      }

      // 2. Create approval record
      await prisma.deploymentApproval.create({
        data: {
          deploymentId: id,
          userId,
          status,
          comment,
        },
      });

      // 3. Check if all required approvals are met (Simplified: one approval for now)
      if (status === "APPROVED") {
        await prisma.deployment.update({
          where: { id },
          data: { status: "APPROVED" },
        });

        // 4. Trigger the job execution
        // Find the job that was waiting for this environment in this run
        const job = await prisma.workflowJob.findFirst({
          where: {
            workflowRunId: deployment.workflowRunId,
            environmentId: deployment.environmentId,
            status: "ACTION_REQUIRED",
          },
        });

        if (job) {
          // Update job status to QUEUED so the runner picker finds it
          await prisma.workflowJob.update({
            where: { id: job.id },
            data: { status: "QUEUED" },
          });
          console.log(
            `✅ [Deployment]: Job ${job.name} approved and queued for execution.`,
          );
        }
      } else {
        await prisma.deployment.update({
          where: { id },
          data: { status: "REJECTED" },
        });

        // Mark job as failed
        await prisma.workflowJob.updateMany({
          where: {
            workflowRunId: deployment.workflowRunId,
            environmentId: deployment.environmentId,
            status: "ACTION_REQUIRED",
          },
          data: { status: "FAILED", conclusion: "SKIPPED" },
        });
      }

      return { message: `Deployment ${status.toLowerCase()} successfully` };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: "Failed to process approval" });
    }
  });

  /**
   * Get environment details for a repository.
   */
  fastify.get("/repositories/:repoId/environments", async (request, reply) => {
    const { repoId } = request.params as { repoId: string };
    const environments = await prisma.environment.findMany({
      where: { repoId },
      include: {
        reviewers: { include: { user: true, team: true } },
        deployments: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    return environments;
  });
}
