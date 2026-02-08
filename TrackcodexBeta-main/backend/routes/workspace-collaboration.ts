import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();

// Helper function to log collaboration activities
async function logCollaborationActivity(
  userId: string,
  action: string,
  workspaceId: string,
  metadata: any = {},
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        workspaceId,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function workspaceCollaborationRoutes(fastify: FastifyInstance) {
  /**
   * Invite user to workspace
   * POST /api/v1/workspaces/:workspaceId/invite
   */
  fastify.post(
    "/workspaces/:workspaceId/invite",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const { email, role } = request.body as { email: string; role: string };
      const userId = (request as any).user?.userId;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        // Check if user has permission to invite (must be OWNER or ADMIN)
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
          return reply.code(403).send({ message: "Insufficient permissions" });
        }

        // Check if user is already a member
        const existingMember = await prisma.user.findUnique({
          where: { email },
        });

        if (existingMember) {
          const isMember = await prisma.workspaceMember.findUnique({
            where: {
              workspaceId_userId: { workspaceId, userId: existingMember.id },
            },
          });

          if (isMember) {
            return reply
              .code(400)
              .send({ message: "User is already a member" });
          }
        }

        // Check for existing pending invite
        const existingInvite = await prisma.workspaceInvite.findFirst({
          where: {
            workspaceId,
            email,
            acceptedAt: null,
          },
        });

        if (existingInvite) {
          return reply.code(400).send({ message: "Invite already sent" });
        }

        // Create invite
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

        const invite = await prisma.workspaceInvite.create({
          data: {
            workspaceId,
            email,
            role,
            invitedBy: userId,
            token,
            expiresAt,
          },
          include: {
            workspace: true,
            inviter: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        });

        // Log activity
        await logCollaborationActivity(
          userId,
          "workspace_invite_sent",
          workspaceId,
          { email, role },
        );

        // Send email notification
        const inviterName =
          (request as any).user?.name ||
          (request as any).user?.username ||
          "A user";
        const workspaceName = invite.workspace.name;

        // We don't await this to avoid blocking the response if email service is slow
        import("../services/emailService").then(({ emailService }) => {
          emailService.sendWorkspaceInvite(
            email,
            workspaceName,
            inviterName,
            token,
          );
        });

        return { invite };
      } catch (error) {
        console.error("Invite error:", error);
        return reply
          .code(500)
          .send({
            message: `Failed to send invite: ${(error as any).message}`,
          });
      }
    },
  );

  /**
   * Get workspace members
   * GET /api/v1/workspaces/:workspaceId/members
   */
  fastify.get(
    "/workspaces/:workspaceId/members",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const userId = (request as any).user?.userId;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const members = await prisma.workspaceMember.findMany({
          where: { workspaceId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                email: true,
              },
            },
            inviter: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        });

        return { members };
      } catch (error) {
        console.error("Get members error:", error);
        return reply.code(500).send({ message: "Failed to fetch members" });
      }
    },
  );

  /**
   * Update member role
   * PATCH /api/v1/workspaces/:workspaceId/members/:memberId
   */
  fastify.patch(
    "/workspaces/:workspaceId/members/:memberId",
    async (request, reply) => {
      const { workspaceId, memberId } = request.params as {
        workspaceId: string;
        memberId: string;
      };
      const { role } = request.body as { role: string };
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        // Check if requester has permission (must be OWNER or ADMIN)
        const requesterMember = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (
          !requesterMember ||
          (requesterMember.role !== "OWNER" && requesterMember.role !== "ADMIN")
        ) {
          return reply.code(403).send({ message: "Insufficient permissions" });
        }

        // Cannot change owner role
        const targetMember = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId: memberId } },
        });

        if (targetMember?.role === "OWNER") {
          return reply.code(400).send({
            message: "Cannot change owner role. Transfer ownership instead.",
          });
        }

        // Update role
        const updatedMember = await prisma.workspaceMember.update({
          where: { workspaceId_userId: { workspaceId, userId: memberId } },
          data: { role },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        });

        // Log activity
        await logCollaborationActivity(
          userId,
          "workspace_member_role_changed",
          workspaceId,
          { memberId, newRole: role, oldRole: targetMember?.role },
        );

        return { member: updatedMember };
      } catch (error) {
        console.error("Update member role error:", error);
        return reply
          .code(500)
          .send({ message: "Failed to update member role" });
      }
    },
  );

  /**
   * Remove member from workspace
   * DELETE /api/v1/workspaces/:workspaceId/members/:memberId
   */
  fastify.delete(
    "/workspaces/:workspaceId/members/:memberId",
    async (request, reply) => {
      const { workspaceId, memberId } = request.params as {
        workspaceId: string;
        memberId: string;
      };
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        // Check if requester has permission
        const requesterMember = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (
          !requesterMember ||
          (requesterMember.role !== "OWNER" && requesterMember.role !== "ADMIN")
        ) {
          return reply.code(403).send({ message: "Insufficient permissions" });
        }

        // Cannot remove owner
        const targetMember = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId: memberId } },
        });

        if (targetMember?.role === "OWNER") {
          return reply
            .code(400)
            .send({ message: "Cannot remove workspace owner" });
        }

        await prisma.workspaceMember.delete({
          where: { workspaceId_userId: { workspaceId, userId: memberId } },
        });

        // Log activity
        await logCollaborationActivity(
          userId,
          "workspace_member_removed",
          workspaceId,
          { memberId, memberRole: targetMember?.role },
        );

        return { message: "Member removed successfully" };
      } catch (error) {
        console.error("Remove member error:", error);
        return reply.code(500).send({ message: "Failed to remove member" });
      }
    },
  );

  /**
   * Leave workspace
   * POST /api/v1/workspaces/:workspaceId/leave
   */
  fastify.post("/workspaces/:workspaceId/leave", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      });

      if (!member) {
        return reply
          .code(404)
          .send({ message: "Not a member of this workspace" });
      }

      if (member.role === "OWNER") {
        return reply
          .code(400)
          .send({ message: "Owner cannot leave. Transfer ownership first." });
      }

      await prisma.workspaceMember.delete({
        where: { workspaceId_userId: { workspaceId, userId } },
      });

      // Log activity
      await logCollaborationActivity(userId, "workspace_left", workspaceId, {
        role: member.role,
      });

      return { message: "Left workspace successfully" };
    } catch (error) {
      console.error("Leave workspace error:", error);
      return reply.code(500).send({ message: "Failed to leave workspace" });
    }
  });

  /**
   * Set/update workspace password
   * POST /api/v1/workspaces/:workspaceId/password
   */
  fastify.post("/workspaces/:workspaceId/password", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const { password } = request.body as { password: string };
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      // Check if user is owner
      const member = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      });

      if (!member || member.role !== "OWNER") {
        return reply.code(403).send({ message: "Only owner can set password" });
      }

      // Validate password length
      if (password.length < 8) {
        return reply
          .code(400)
          .send({ message: "Password must be at least 8 characters" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { accessPassword: hashedPassword },
      });

      // Log activity
      await logCollaborationActivity(
        userId,
        "workspace_password_set",
        workspaceId,
        {},
      );

      return { message: "Password set successfully" };
    } catch (error) {
      console.error("Set password error:", error);
      return reply.code(500).send({ message: "Failed to set password" });
    }
  });

  /**
   * Remove workspace password
   * DELETE /api/v1/workspaces/:workspaceId/password
   */
  fastify.delete(
    "/workspaces/:workspaceId/password",
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        // Check if user is owner
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (!member || member.role !== "OWNER") {
          return reply
            .code(403)
            .send({ message: "Only owner can remove password" });
        }

        await prisma.workspace.update({
          where: { id: workspaceId },
          data: { accessPassword: null },
        });

        // Log activity
        await logCollaborationActivity(
          userId,
          "workspace_password_removed",
          workspaceId,
          {},
        );

        return { message: "Password removed successfully" };
      } catch (error) {
        console.error("Remove password error:", error);
        return reply.code(500).send({ message: "Failed to remove password" });
      }
    },
  );

  /**
   * Verify workspace password
   * POST /api/v1/workspaces/:workspaceId/verify-password
   */
  fastify.post(
    "/workspaces/:workspaceId/verify-password",
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const { password } = request.body as { password: string };

      try {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
          select: { accessPassword: true },
        });

        if (!workspace) {
          return reply.code(404).send({ message: "Workspace not found" });
        }

        if (!workspace.accessPassword) {
          return { valid: true }; // No password set
        }

        const valid = await bcrypt.compare(password, workspace.accessPassword);

        return { valid };
      } catch (error) {
        console.error("Verify password error:", error);
        return reply.code(500).send({ message: "Failed to verify password" });
      }
    },
  );

  /**
   * Get pending invites for current user
   * GET /api/v1/workspace-invites
   */
  fastify.get(
    "/workspace-invites",
    { preHandler: requireAuth },
    async (request, reply) => {
      const userId = (request as any).user?.userId;
      const userEmail = (request as any).user?.email;

      if (!userId || !userEmail) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const invites = await prisma.workspaceInvite.findMany({
          where: {
            email: userEmail,
            acceptedAt: null,
            expiresAt: { gt: new Date() },
          },
          include: {
            workspace: {
              select: {
                id: true,
                name: true,
                description: true,
                visibility: true,
              },
            },
            inviter: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return { invites };
      } catch (error) {
        console.error("Get invites error:", error);
        return reply.code(500).send({ message: "Failed to fetch invites" });
      }
    },
  );

  /**
   * Accept workspace invite
   * POST /api/v1/workspace-invites/:token/accept
   */
  fastify.post(
    "/workspace-invites/:token/accept",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { token } = request.params as { token: string };
      const userId = (request as any).user?.userId;
      const userEmail = (request as any).user?.email;

      if (!userId || !userEmail) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const invite = await prisma.workspaceInvite.findUnique({
          where: { token },
        });

        if (!invite) {
          return reply.code(404).send({ message: "Invite not found" });
        }

        if (invite.email !== userEmail) {
          return reply.code(403).send({ message: "Invite not for this email" });
        }

        if (invite.acceptedAt) {
          return reply.code(400).send({ message: "Invite already accepted" });
        }

        if (invite.expiresAt < new Date()) {
          return reply.code(400).send({ message: "Invite expired" });
        }

        // Create workspace member
        await prisma.workspaceMember.create({
          data: {
            workspaceId: invite.workspaceId,
            userId,
            role: invite.role,
            invitedBy: invite.invitedBy,
          },
        });

        // Mark invite as accepted
        await prisma.workspaceInvite.update({
          where: { token },
          data: { acceptedAt: new Date() },
        });

        // Log activity
        await logCollaborationActivity(
          userId,
          "workspace_invite_accepted",
          invite.workspaceId,
          { role: invite.role },
        );

        return { message: "Invite accepted successfully" };
      } catch (error) {
        console.error("Accept invite error:", error);
        return reply.code(500).send({ message: "Failed to accept invite" });
      }
    },
  );

  /**
   * Decline workspace invite
   * POST /api/v1/workspace-invites/:token/decline
   */
  fastify.post("/workspace-invites/:token/decline", async (request, reply) => {
    const { token } = request.params as { token: string };
    const userEmail = (request as any).user?.email;

    if (!userEmail) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      const invite = await prisma.workspaceInvite.findUnique({
        where: { token },
      });

      if (!invite) {
        return reply.code(404).send({ message: "Invite not found" });
      }

      if (invite.email !== userEmail) {
        return reply.code(403).send({ message: "Invite not for this email" });
      }

      await prisma.workspaceInvite.delete({
        where: { token },
      });

      return { message: "Invite declined successfully" };
    } catch (error) {
      console.error("Decline invite error:", error);
      return reply.code(500).send({ message: "Failed to decline invite" });
    }
  });

  /**
   * Cancel workspace invite
   * DELETE /api/v1/workspaces/:workspaceId/invites/:inviteId
   */
  fastify.delete(
    "/workspaces/:workspaceId/invites/:inviteId",
    async (request, reply) => {
      const { workspaceId, inviteId } = request.params as {
        workspaceId: string;
        inviteId: string;
      };
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        // Check if user has permission
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
          return reply.code(403).send({ message: "Insufficient permissions" });
        }

        await prisma.workspaceInvite.delete({
          where: { id: inviteId },
        });

        return { message: "Invite cancelled successfully" };
      } catch (error) {
        console.error("Cancel invite error:", error);
        return reply.code(500).send({ message: "Failed to cancel invite" });
      }
    },
  );

  /**
   * Get user's permissions for workspace
   * GET /api/v1/workspaces/:workspaceId/permissions
   */
  fastify.get(
    "/workspaces/:workspaceId/permissions",
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const userId = (request as any).user?.id;

      if (!userId) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      try {
        const member = await prisma.workspaceMember.findUnique({
          where: { workspaceId_userId: { workspaceId, userId } },
        });

        if (!member) {
          return { role: null, permissions: [] };
        }

        const permissions = {
          canRead: true,
          canWrite: ["OWNER", "ADMIN", "WRITE"].includes(member.role),
          canManageMembers: ["OWNER", "ADMIN"].includes(member.role),
          canDelete: member.role === "OWNER",
          canTransferOwnership: member.role === "OWNER",
          canManagePassword: member.role === "OWNER",
        };

        return { role: member.role, permissions };
      } catch (error) {
        console.error("Get permissions error:", error);
        return reply.code(500).send({ message: "Failed to fetch permissions" });
      }
    },
  );

  /**
   * Transfer workspace ownership
   * POST /api/v1/workspaces/:workspaceId/transfer
   */
  fastify.post("/workspaces/:workspaceId/transfer", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const { newOwnerId } = request.body as { newOwnerId: string };
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      // Check if requester is owner
      const currentOwner = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      });

      if (!currentOwner || currentOwner.role !== "OWNER") {
        return reply
          .code(403)
          .send({ message: "Only owner can transfer ownership" });
      }

      // Check if new owner is a member
      const newOwner = await prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId: newOwnerId } },
      });

      if (!newOwner) {
        return reply
          .code(400)
          .send({ message: "New owner must be a workspace member" });
      }

      // Transfer ownership
      await prisma.$transaction([
        // Set current owner to ADMIN
        prisma.workspaceMember.update({
          where: { workspaceId_userId: { workspaceId, userId } },
          data: { role: "ADMIN" },
        }),
        // Set new owner
        prisma.workspaceMember.update({
          where: { workspaceId_userId: { workspaceId, userId: newOwnerId } },
          data: { role: "OWNER" },
        }),
      ]);

      // Log activity for both users
      await logCollaborationActivity(
        userId,
        "workspace_ownership_transferred",
        workspaceId,
        { newOwnerId },
      );
      await logCollaborationActivity(
        newOwnerId,
        "workspace_ownership_received",
        workspaceId,
        { previousOwnerId: userId },
      );

      return { message: "Ownership transferred successfully" };
    } catch (error) {
      console.error("Transfer ownership error:", error);
      return reply.code(500).send({ message: "Failed to transfer ownership" });
    }
  });
}
