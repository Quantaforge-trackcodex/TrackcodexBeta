import { FastifyInstance } from "fastify";
import { docker } from "../services/docker";
import { PipelineService } from "../services/pipelineService";

export async function cloudRoutes(fastify: FastifyInstance) {
  // List all running TrackCodex containers
  fastify.get("/containers", async () => {
    const containers = await docker.listContainers({ all: true });
    return containers
      .filter((c: any) =>
        c.Names.some((name: string) => name.includes("trackcodex-")),
      )
      .map((c: any) => ({
        id: c.Id,
        name: c.Names[0].replace("/", ""),
        image: c.Image,
        status: c.Status,
        state: c.State,
        ports: c.Ports,
      }));
  });

  // Stop a specific container
  fastify.post<{
    Params: { id: string };
  }>("/containers/:id/stop", async (request, reply) => {
    const { id } = request.params;
    try {
      const container = docker.getContainer(id);
      await container.stop();
      return { status: "success", message: "Container stopped." };
    } catch (error: any) {
      return reply
        .code(500)
        .send({ message: "Failed to stop container", error: error.message });
    }
  });

  // List all pipelines
  fastify.get<{
    Querystring: { workspaceId?: string };
  }>("/pipelines", async (request) => {
    const { workspaceId } = request.query;
    return PipelineService.listPipelines(workspaceId);
  });

  // Trigger a new pipeline build
  fastify.post<{
    Body: { workspaceId: string };
  }>("/pipelines", async (request) => {
    const { workspaceId } = request.body;
    if (!workspaceId) throw new Error("workspaceId is required");

    const pipeline = PipelineService.createPipeline(workspaceId);
    // Trigger build asynchronously
    PipelineService.runPipeline(pipeline.id);

    return pipeline;
  });

  // Get specific pipeline logs
  fastify.get<{
    Params: { id: string };
  }>("/pipelines/:id", async (request, reply) => {
    const { id } = request.params;
    const pipeline = PipelineService.getPipeline(id);
    if (!pipeline)
      return reply.code(404).send({ message: "Pipeline not found" });
    return pipeline;
  });
}
