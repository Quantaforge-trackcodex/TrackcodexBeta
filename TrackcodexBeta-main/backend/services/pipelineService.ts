import { v4 as uuidv4 } from "uuid";

export interface Pipeline {
  id: string;
  workspaceId: string;
  status: "Pending" | "Running" | "Success" | "Failed";
  startedAt: string;
  completedAt?: string;
  steps: PipelineStep[];
}

export interface PipelineStep {
  name: string;
  status: "Pending" | "Running" | "Success" | "Failed";
  logs: string[];
}

const pipelines = new Map<string, Pipeline>();

export class PipelineService {
  static createPipeline(workspaceId: string): Pipeline {
    const id = uuidv4();
    const pipeline: Pipeline = {
      id,
      workspaceId,
      status: "Pending",
      startedAt: new Date().toISOString(),
      steps: [
        { name: "Environment Setup", status: "Pending", logs: [] },
        { name: "Dependency Audit", status: "Pending", logs: [] },
        { name: "Compilation", status: "Pending", logs: [] },
        { name: "Unit Tests", status: "Pending", logs: [] },
        { name: "Neural Integrity Check", status: "Pending", logs: [] },
        { name: "Deployment", status: "Pending", logs: [] },
      ],
    };
    pipelines.set(id, pipeline);
    return pipeline;
  }

  static async runPipeline(id: string) {
    const pipeline = pipelines.get(id);
    if (!pipeline) return;

    pipeline.status = "Running";

    for (const step of pipeline.steps) {
      step.status = "Running";
      step.logs.push(
        `[${new Date().toISOString()}] Initializing ${step.name}...`,
      );

      // Simulate build complexity
      await new Promise((r) => setTimeout(r, 2000));

      step.logs.push(
        `[${new Date().toISOString()}] ${step.name} completed successfully.`,
      );
      step.status = "Success";
    }

    pipeline.status = "Success";
    pipeline.completedAt = new Date().toISOString();
  }

  static getPipeline(id: string): Pipeline | undefined {
    return pipelines.get(id);
  }

  static listPipelines(workspaceId?: string): Pipeline[] {
    const all = Array.from(pipelines.values());
    return workspaceId ? all.filter((p) => p.workspaceId === workspaceId) : all;
  }
}
