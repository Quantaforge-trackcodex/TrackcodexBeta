import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function applicationRoutes(fastify: FastifyInstance) {
  // 1. Submit Application
  fastify.post<{
    Params: { id: string };
    Body: { applicantId: string; coverLetter?: string; resumeUrl?: string };
  }>("/jobs/:id/apply", async (request, reply) => {
    const { id } = request.params; // Job ID
    const { applicantId, coverLetter, resumeUrl } = request.body;

    if (!applicantId)
      return reply.code(400).send({ message: "Applicant ID required" });

    // Check duplicate
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_applicantId: { jobId: id, applicantId } },
    });

    if (existing)
      return reply
        .code(409)
        .send({ message: "You have already applied to this job." });

    const application = await prisma.jobApplication.create({
      data: {
        jobId: id,
        applicantId,
        coverLetter,
        resumeUrl,
        status: "Screening", // Initial State
        stage: "Applied",
      },
    });

    // TODO: Trigger BullMQ Job here for email notification

    return { success: true, application };
  });

  // 2. Employer Kanban Data
  fastify.get<{
    Params: { jobId: string };
  }>("/applications/kanban/:jobId", async (request, reply) => {
    const { jobId } = request.params;

    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        applicant: {
          select: { id: true, name: true, avatar: true, username: true },
        },
      },
    });

    // Group by Stage for Frontend Kanban
    // Stages: Applied, Phone Screen, Interview, Offer, Hired, Rejected
    const columns: Record<string, any[]> = {
      Applied: [],
      "Phone Screen": [],
      Interview: [],
      Offer: [],
      Hired: [],
      Rejected: [],
    };

    // Populate
    applications.forEach((app) => {
      if (columns[app.stage]) {
        columns[app.stage].push(app);
      } else {
        // Fallback for unknown stages
        if (!columns["Applied"]) columns["Applied"] = [];
        columns["Applied"].push(app);
      }
    });

    return columns;
  });

  // 3. Move Candidate (Drag & Drop)
  fastify.patch<{
    Params: { id: string };
    Body: { stage: string; status?: string };
  }>("/applications/:id/move", async (request, reply) => {
    const { id } = request.params;
    const { stage, status } = request.body;

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        stage,
        status: status || "Pending", // Optional status update
      },
    });

    return { success: true, application: updated };
  });
}
