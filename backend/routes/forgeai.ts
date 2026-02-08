import { FastifyInstance } from "fastify";
import { AIOrchestrator } from "../services/aiOrchestrator";
import { ContextGraph } from "../services/contextGraph";

export async function forgeAIRoutes(fastify: FastifyInstance) {
  // Context-Aware Completion
  fastify.post("/complete", async (request) => {
    const { prompt, provider, model, workspaceId, systemPrompt } =
      request.body as any;

    let enhancedPrompt = prompt;

    // Expand context if workspaceId is provided (Graph Intelligence)
    if (workspaceId) {
      console.log(
        `🧠 ForgeAI: Expanding context for workspace ${workspaceId}...`,
      );
      const context = await ContextGraph.getRelevantContext(
        workspaceId,
        prompt,
      );

      if (context.length > 0) {
        enhancedPrompt = `
Context from current workspace:
${context.map((c) => `File: ${c.fileName}\n${c.content}`).join("\n---\n")}

User Question: ${prompt}
        `.trim();
      }
    }

    return await AIOrchestrator.generateResponse(enhancedPrompt, {
      provider,
      model,
      systemPrompt:
        systemPrompt ||
        "You are ForgeAI, an expert engineering co-pilot. Use the provided context to give highly accurate, technical responses.",
    });
  });

  // Neural Synthesis (Direct Code Injection Trigger)
  fastify.post("/synthesize", async (request) => {
    const { requirement, workspaceId } = request.body as any;

    // In a real scenario, this would call AuroraAI service to generate files
    // and potentially create a branch or apply directly to a temporary VFS partition.

    return {
      status: "success",
      message:
        "Neural Synthesis partition initialized. Reviewing requirement context...",
      suggestedFiles: [
        "src/components/NewFeature.tsx",
        "src/hooks/useNewFeature.ts",
      ],
    };
  });
}
