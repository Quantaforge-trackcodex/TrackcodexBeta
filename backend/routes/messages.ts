import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { AppError, BadRequest, NotFound, Forbidden } from "../utils/AppError";
import { RealtimeService } from "../services/realtime";

const prisma = new PrismaClient();

export async function messageRoutes(fastify: FastifyInstance) {
  // 1. Get All Conversations for Current User
  fastify.get("/conversations", async (request, reply) => {
    const user = (request as any).user;
    if (!user) throw new AppError("Unauthorized", 401);

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Last message preview
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return conversations;
  });

  // 2. Create or Get Direct Conversation (One-on-One)
  fastify.post("/conversations", async (request, reply) => {
    const user = (request as any).user;
    if (!user) throw new AppError("Unauthorized", 401);

    const { targetUserId } = request.body as { targetUserId: string };
    if (!targetUserId) throw BadRequest("Target User ID required");

    if (user.id === targetUserId) {
      throw BadRequest("Cannot message yourself");
    }

    // Check availability
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) throw NotFound("User not found");

    // Find existing direct conversation
    const existing = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create new
    const conversation = await prisma.conversation.create({
      data: {
        type: "DIRECT",
        participants: {
          create: [{ userId: user.id }, { userId: targetUserId }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return conversation;
  });

  // 3. Get Messages for Conversation
  fastify.get("/conversations/:id/messages", async (request, reply) => {
    const user = (request as any).user;
    const { id } = request.params as { id: string };

    // Verify membership
    const membership = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: id,
          userId: user.id,
        },
      },
    });

    if (!membership) throw Forbidden("Not a member of this conversation");

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
      take: 100, // Limit for now
    });

    return messages;
  });

  // 4. Send Message
  fastify.post("/conversations/:id/messages", async (request, reply) => {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const { content } = request.body as { content: string };

    if (!content || !content.trim())
      throw BadRequest("Message cannot be empty");

    // Verify membership
    const membership = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: id,
          userId: user.id,
        },
      },
    });

    if (!membership) throw Forbidden("Not a member of this conversation");

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    // Notify others via Socket.io
    // Since RealtimeService handles broadcasting, we'll emit to "conversation_room_${id}"
    // Assuming RealtimeService is setup for this or we just accept poll for now.
    // Let's assume polling in Phase 1, but we'll add the hook if RealtimeService exists.
    try {
      // Broadcast logic here if RealtimeService supports room emission
      // RealtimeService.to(`conversation:${id}`).emit("new_message", message);
    } catch (e) {
      // harmless fail for now if socket not ready
    }

    return message;
  });
}
