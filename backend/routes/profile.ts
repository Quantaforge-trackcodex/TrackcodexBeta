import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ResumeService } from "../services/resumeService";
import { requireAuth } from "../middleware/auth";

export async function profileRoutes(server: FastifyInstance) {
  /**
   * Upload Resume
   * POST /users/:userId/resume
   */
  server.post(
    "/:userId/resume",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const currentUser = (req as any).user;

      // Authorization: Only the user themselves can upload
      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      // Check for multipart
      if (!req.isMultipart()) {
        return reply
          .status(400)
          .send({ error: "Request must be multipart/form-data" });
      }

      try {
        const data = await req.file();
        if (!data) {
          return reply.status(400).send({ error: "No file uploaded" });
        }

        // Read file buffer
        const buffer = await data.toBuffer();

        const result = await ResumeService.uploadResume(
          userId,
          data.filename,
          buffer,
          data.mimetype,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          url: result.url,
          message: "Resume uploaded successfully",
        });
      } catch (error) {
        console.error("Resume upload error:", error);
        return reply.status(500).send({ error: "Failed to upload resume" });
      }
    },
  );

  /**
   * Download Resume
   * GET /users/:userId/resume
   */
  server.get(
    "/:userId/resume",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;

      try {
        const result = await ResumeService.getResume(userId);

        if (result.error) {
          return reply.status(404).send({ error: result.error });
        }

        reply.header(
          "Content-Disposition",
          `attachment; filename="${result.filename}"`,
        );
        reply.type("application/octet-stream");
        return reply.send(result.buffer);
      } catch (error) {
        console.error("Resume download error:", error);
        return reply.status(500).send({ error: "Failed to download resume" });
      }
    },
  );

  /**
   * Delete Resume
   * DELETE /users/:userId/resume
   */
  server.delete(
    "/:userId/resume",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const currentUser = (req as any).user;

      // Authorization
      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      try {
        const result = await ResumeService.deleteResume(userId);

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Resume deleted successfully",
        });
      } catch (error) {
        console.error("Resume deletion error:", error);
        return reply.status(500).send({ error: "Failed to delete resume" });
      }
    },
  );

  /**
   * Update Profile README
   * PUT /users/:userId/profile-readme
   */
  server.put(
    "/:userId/profile-readme",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{
        Params: { userId: string };
        Body: { readme: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const { readme } = req.body;
      const currentUser = (req as any).user;

      // Authorization
      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      if (typeof readme !== "string") {
        return reply.status(400).send({ error: "Invalid README content" });
      }

      try {
        const result = await ResumeService.updateProfileReadme(userId, readme);

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Profile README updated successfully",
        });
      } catch (error) {
        console.error("Profile README update error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to update profile README" });
      }
    },
  );

  /**
   * Update Privacy Settings
   * PATCH /users/:userId/privacy
   */
  server.patch(
    "/:userId/privacy",
    { preHandler: requireAuth },
    async (
      req: FastifyRequest<{
        Params: { userId: string };
        Body: { showResume?: boolean; showReadme?: boolean };
      }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const { showResume, showReadme } = req.body;
      const currentUser = (req as any).user;

      // Authorization
      if (currentUser.id !== userId) {
        return reply.status(403).send({ error: "Unauthorized" });
      }

      try {
        const result = await ResumeService.updatePrivacy(
          userId,
          showResume,
          showReadme,
        );

        if (!result.success) {
          return reply.status(400).send({ error: result.error });
        }

        return reply.send({
          success: true,
          message: "Privacy settings updated successfully",
        });
      } catch (error) {
        console.error("Privacy update error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to update privacy settings" });
      }
    },
  );

  /**
   * Get Profile Card (for sharing)
   * GET /users/:userId/profile-card
   */
  server.get(
    "/:userId/profile-card",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;

      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
            company: true,
            location: true,
            website: true,
            github: true,
            twitter: true,
            linkedin: true,
            profileReadme: true,
            showReadme: true,
            showResume: true,
            resumeUrl: true,
          },
        });

        if (!user) {
          return reply.status(404).send({ error: "User not found" });
        }

        return reply.send({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            company: user.company,
            location: user.location,
            website: user.website,
            github: user.github,
            twitter: user.twitter,
            linkedin: user.linkedin,
            readme: user.showReadme ? user.profileReadme : null,
            hasResume: user.showResume && !!user.resumeUrl,
          },
          profileUrl: `${process.env.FRONTEND_URL || "http://localhost:3001"}/profile/${userId}`,
        });
      } catch (error) {
        console.error("Profile card error:", error);
        return reply
          .status(500)
          .send({ error: "Failed to generate profile card" });
      }
    },
  );
}
