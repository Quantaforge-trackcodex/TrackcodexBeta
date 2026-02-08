import yaml from "js-yaml";
import { PrismaClient } from "@prisma/client";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

export interface WorkflowDefinition {
  name: string;
  on: string | string[] | { [key: string]: unknown };
  jobs: {
    [key: string]: {
      name?: string;
      "runs-on": string;
      steps: Array<{
        name?: string;
        run?: string;
        uses?: string;
        with?: { [key: string]: unknown };
      }>;
    };
  };
}

/**
 * Integravity Workflow Service
 * Handles YAML parsing, event triggering, and job orchestration.
 */
export class WorkflowService {
  /**
   * Triggers workflows for a repository based on an event.
   */
  static async triggerWorkflows(
    repoId: string,
    event: string,
    commitSha: string,
  ) {
    console.log(
      `🚀 [WorkflowService]: Triggering workflows for ${repoId} on event: ${event}`,
    );

    // In a real setup, we'd read .trackcodex/workflows/*.yml from the repo filesystem.
    // For this implementation, we simulate finding a 'ci.yml' workflow.
    // AI-Driven Pipeline Generation (Zero Config)
    let pipelineYaml = "";

    // In real implementation: check file exists first. If NOT exists:
    console.log(
      `🤖 [WorkflowService]: No 'ci.yml' found. Asking Gemini to generate one...`,
    );

    // Request AI to generate config based on repo context.
    const prompt = `
      You are a DevOps expert. Generate a valid GitHub Actions YAML for a generic Node.js/TypeScript project.
      The pipeline should includes stages for: Install, Lint, Test, and Build.
      Return ONLY raw YAML code. No markdown fences.
    `;

    try {
      // Lazy import to avoid circular dep if needed, or import at top
      const { AIOrchestrator } = await import("./aiOrchestrator");
      const aiResponse = await AIOrchestrator.generateResponse(prompt, {
        model: "gemini-1.5-flash",
        systemPrompt: "You are a CI/CD generator. Output only valid YAML.",
      });

      // Sanitization: Remove markdown blocks if AI adds them
      pipelineYaml = aiResponse.content
        .replace(/```yaml/g, "")
        .replace(/```/g, "")
        .trim();
      console.log(
        `✨ [WorkflowService]: AI generated pipeline:\n${pipelineYaml}`,
      );
    } catch (e) {
      console.warn(
        "⚠️ [WorkflowService]: AI generation failed, falling back to default.",
        e,
      );
      pipelineYaml = `
name: Fallback CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      `;
    }

    try {
      const config = yaml.load(pipelineYaml) as WorkflowDefinition;

      // 1. Check if event matches
      if (!this.shouldTrigger(config.on, event)) return;

      // 2. Create WorkflowRun
      const run = await prisma.workflowRun.create({
        data: {
          repoId,
          workflowName: config.name,
          commitSha,
          event,
          status: "QUEUED",
        },
      });

      // 3. Generate Execution Plan (DAG)
      // 3. Generate Execution Plan (DAG)
      // Determine which jobs can start immediately (no 'needs')
      const jobsToStart: any[] = [];

      for (const [jobId, jobDef] of Object.entries(config.jobs)) {
        const needs = (jobDef as any).needs
          ? Array.isArray((jobDef as any).needs)
            ? (jobDef as any).needs
            : [(jobDef as any).needs]
          : [];
        const isReady = needs.length === 0;
        const envName = (jobDef as any).environment;

        let environmentId: string | undefined;
        let requiresApproval = false;

        if (envName) {
          const env = await (prisma as any).environment.findUnique({
            where: { repoId_name: { repoId, name: envName } },
            include: { reviewers: true },
          });
          if (env) {
            environmentId = env.id;
            requiresApproval = env.reviewers.length > 0;
          }
        }

        const jobStatus = isReady
          ? requiresApproval
            ? "ACTION_REQUIRED"
            : "QUEUED"
          : "WAITING";

        const job = await prisma.workflowJob.create({
          data: {
            workflowRunId: run.id,
            name: jobId, // Normalized ID
            status: jobStatus,
            needs: needs,
            definition: jobDef as any,
            matrix: (jobDef as any).strategy?.matrix || null, // Capture matrix
            steps: jobDef.steps as any,
            environmentId: environmentId,
          } as any,
        });

        if (requiresApproval && isReady) {
          await (prisma as any).deployment.create({
            data: {
              environmentId: environmentId!,
              workflowRunId: run.id,
              status: "WAITING",
            },
          });
          console.log(
            `🔒 [WorkflowService]: Job ${jobId} targeting ${envName} requires approval.`,
          );
        }

        if (isReady && !requiresApproval) jobsToStart.push(job);
      }

      await AuditService.log({
        actorId: "system",
        action: "WORKFLOW_TRIGGER",
        resource: `run:${run.id}`,
        details: { workflow: config.name, event },
      });

      // 4. Schedule Initial Jobs on Engine
      // Import here to avoid cycle if any (CIEngine is interface)
      const { DroneAdapter } = await import("./ci/droneAdapter");
      const engine = new DroneAdapter();

      for (const job of jobsToStart) {
        try {
          const { externalId } = await engine.createRun({
            repoId,
            commitSha,
            branch: "main", // TODO: Determine branch from commit or event
            workflowId: config.name,
            env: {}, // TODO: Inject secrets here
          });

          // Update job with external ID
          await prisma.workflowJob.update({
            where: { id: job.id },
            data: { externalId, status: "IN_PROGRESS" }, // Mark as sent to engine
          });
        } catch (err) {
          console.error(`Failed to schedule job ${job.name}`, err);
          // Update status to failure?
        }
      }

      return run;
    } catch (err) {
      console.error(
        "❌ [WorkflowService]: Failed to parse or trigger workflow:",
        err,
      );
      throw err;
    }
  }

  private static shouldTrigger(
    on: WorkflowDefinition["on"],
    event: string,
  ): boolean {
    if (typeof on === "string") return on === event;
    if (Array.isArray(on)) return on.includes(event);
    if (typeof on === "object") return !!on[event];
    return false;
  }

  /**
   * Fetch pending jobs for a runner based on labels.
   */
  static async fetchAvailableJobs(_runnerLabels: string[]) {
    // Basic matching: find queued jobs that don't have a runner yet.
    // Production logic would match runner labels to job requirements.
    return await prisma.workflowJob.findMany({
      where: {
        status: "QUEUED",
        runnerId: null,
      },
      include: {
        workflowRun: {
          include: {
            repo: true,
          },
        },
      },
    });
  }
}
