import { PrismaClient } from "@prisma/client";
import { RealtimeService } from "./realtime";

const prisma = new PrismaClient();

export class ActivityService {
  /**
   * Logs an activity to the database and broadcasts it in real-time
   */
  static async log(params: {
    userId: string;
    action: string;
    details?: any;
    workspaceId?: string;
    repoId?: string;
  }) {
    const { userId, action, details, workspaceId, repoId } = params;

    try {
      // 1. Persist to Database
      const logEntry = await prisma.activityLog.create({
        data: {
          userId,
          action,
          workspaceId,
          repoId,
          details: details || {},
        },
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
      });

      // 2. Broadcast via RealtimeService
      // Broadcast to workspace room if applicable
      if (workspaceId) {
        RealtimeService.broadcastToRoom(workspaceId, {
          type: "ACTIVITY_EVENT",
          activity: logEntry,
          workspaceId,
        });
      }

      // Broadcast to repository room if applicable
      if (repoId) {
        RealtimeService.broadcastToRoom(repoId, {
          type: "ACTIVITY_EVENT",
          activity: logEntry,
          repoId,
        });
      }

      // Also broadcast globally or to specific users if needed
      // For now, workspace/repo scoped broadcast is sufficient

      return logEntry;
    } catch (err) {
      console.error("❌ Failed to log activity:", err);
      return null;
    }
  }

  /**
   * Fetches recent activity for a specific scope
   */
  static async getRecent(filters: {
    userId?: string;
    workspaceId?: string;
    repoId?: string;
    limit?: number;
  }) {
    const { userId, workspaceId, repoId, limit = 50 } = filters;

    return await prisma.activityLog.findMany({
      where: {
        userId: userId || undefined,
        workspaceId: workspaceId || undefined,
        repoId: repoId || undefined,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
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
    });
  }
}
