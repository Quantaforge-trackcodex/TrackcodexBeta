import { PrismaClient } from "@prisma/client";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

/**
 * Integravity Runner Service
 * Manages external self-hosted runners, health checks, and job assignment.
 */
export class RunnerService {
  /**
   * Register a new runner within a runner group.
   */
  static async registerRunner(data: {
    runnerGroupId: string;
    name: string;
    os: string;
    arch: string;
    labels: string[];
    version: string;
  }) {
    const runner = await prisma.runner.create({
      data: {
        runnerGroupId: data.runnerGroupId,
        name: data.name,
        status: "ONLINE",
        os: data.os,
        arch: data.arch,
        labels: data.labels,
        version: data.version,
        lastSeenAt: new Date(),
      },
    });

    await AuditService.log({
      actorId: "system",
      action: "RUNNER_REGISTER",
      resource: `runner:${runner.id}`,
      details: { name: data.name, group: data.runnerGroupId },
    });

    return runner;
  }

  /**
   * Update runner heartbeat and status.
   */
  static async updateHeartbeat(
    runnerId: string,
    status: "ONLINE" | "BUSY" | "OFFLINE",
  ) {
    return await prisma.runner.update({
      where: { id: runnerId },
      data: {
        status,
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Assign a job to a specific runner.
   */
  static async assignJob(jobId: string, runnerId: string) {
    return await prisma.workflowJob.update({
      where: { id: jobId },
      data: {
        runnerId,
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });
  }

  /**
   * Finalize a workflow job with logs and conclusion.
   */
  static async completeJob(
    jobId: string,
    data: { conclusion: string; logs: string; steps?: any },
  ) {
    const job = await prisma.workflowJob.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        conclusion: data.conclusion,
        logs: data.logs,
        steps: data.steps,
        completedAt: new Date(),
      },
    });

    // Check for dependent jobs to unblock (DAG Dispatch)
    await this.dispatchDependentJobs(job.workflowRunId);

    // Check if all jobs in the run are complete to finalize the WorkflowRun
    await this.checkRunCompletion(job.workflowRunId);

    return job;
  }

  /**
   * Checks for WAITING jobs that can be promoted to QUEUED
   */
  private static async dispatchDependentJobs(runId: string) {
    // 1. Fetch all jobs in the run
    const allJobs = await prisma.workflowJob.findMany({
      where: { workflowRunId: runId },
    });

    const completedJobNames = new Set(
      allJobs
        .filter((j) => j.status === "COMPLETED" && j.conclusion === "SUCCESS")
        .map((j) => j.name),
    );

    const waitingJobs = allJobs.filter((j) => j.status === "WAITING");

    for (const job of waitingJobs) {
      // Check if all dependencies are satisfied
      // 'needs' is String[] in schema
      const needs = job.needs || [];
      const dependenciesMet = needs.every((depName) =>
        completedJobNames.has(depName),
      );

      if (dependenciesMet) {
        // Promote to QUEUED
        await prisma.workflowJob.update({
          where: { id: job.id },
          data: { status: "QUEUED" },
        });

        await AuditService.log({
          actorId: "system",
          action: "JOB_QUEUED",
          resource: `job:${job.id}`,
          details: { reason: "dependencies_met" },
        });
      }
    }
  }

  private static async checkRunCompletion(runId: string) {
    const run = await prisma.workflowRun.findUnique({
      where: { id: runId },
      include: { jobs: true },
    });

    if (!run) return;

    // Run is complete if ALL jobs are COMPLETED, SKIPPED, or CANCELLED.
    // Simplifying to: No jobs are QUEUED, IN_PROGRESS, or WAITING.
    const activeStatuses = ["QUEUED", "IN_PROGRESS", "WAITING"];
    const hasActiveJobs = run.jobs.some((j) =>
      activeStatuses.includes(j.status),
    );

    if (!hasActiveJobs) {
      const anyFailed = run.jobs.some((j) => j.conclusion === "FAILURE");
      await prisma.workflowRun.update({
        where: { id: runId },
        data: {
          status: "COMPLETED",
          conclusion: anyFailed ? "FAILURE" : "SUCCESS",
        },
      });
    }
  }
}
