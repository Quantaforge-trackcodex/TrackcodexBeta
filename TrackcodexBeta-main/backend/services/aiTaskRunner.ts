import { PrismaClient } from "@prisma/client";
import { AIOrchestrator } from "./aiOrchestrator";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

export class AITaskRunner {
  private static isPolling = false;
  private static POLL_INTERVAL = 5000; // 5 seconds

  /**
   * Starts the polling loop (Call this on server startup)
   */
  static start() {
    if (this.isPolling) return;
    this.isPolling = true;
    console.log("🤖 [AITaskRunner]: AI Agent started polling.");
    this.pollLoop();
  }

  private static async pollLoop() {
    while (this.isPolling) {
      try {
        await this.processNextTask();
      } catch (error) {
        console.error("❌ [AITaskRunner]: Error in poll loop:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, this.POLL_INTERVAL));
    }
  }

  /**
   * Process a single priority task
   */
  static async processNextTask() {
    // 1. Find oldest PENDING task
    const task = await prisma.aITask.findFirst({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });

    if (!task) return;

    console.log(
      `🤖 [AITaskRunner]: Processing task ${task.id} (${task.taskName})`,
    );

    // 2. Mark as PROCESSING
    await prisma.aITask.update({
      where: { id: task.id },
      data: { status: "PROCESSING" },
    });

    try {
      // 3. Execute via Orchestrator
      // Construct prompt with context
      let finalPrompt = task.prompt;
      if (task.context) {
        finalPrompt += `\n\nContext:\n${JSON.stringify(task.context)}`;
      }

      const response = await AIOrchestrator.generateResponse(finalPrompt, {
        model: task.model,
        systemPrompt:
          "You are the TrackCodex Copilot. Assist with code tasks precisely.",
      });

      // 4. Save Result
      await prisma.aITask.update({
        where: { id: task.id },
        data: {
          status: "COMPLETED",
          result: response.content,
        },
      });

      await AuditService.log({
        actorId: "system",
        action: "AI_TASK_COMPLETE",
        resource: `task:${task.id}`,
        details: { model: response.model, tokens: response.content.length },
      });
    } catch (error: any) {
      console.error(`❌ [AITaskRunner]: Task ${task.id} failed:`, error);

      await prisma.aITask.update({
        where: { id: task.id },
        data: {
          status: "FAILED",
          result: error.message || "Unknown error",
        },
      });
    }
  }
}
