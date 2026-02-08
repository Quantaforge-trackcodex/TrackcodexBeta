import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();

export async function userRoutes(fastify: FastifyInstance) {
  // Export User Data
  fastify.get(
    "/users/me/export",
    { preHandler: requireAuth },
    async (request, reply) => {
      const currentUser = (request as any).user;
      try {
        const userData = await prisma.user.findUnique({
          where: { id: currentUser.userId },
          include: {
            profile: true,
            posts: true,
            comments: true,
            repositories: true,
            organizations: true,
            followings: true,
            followers: true,
          },
        });

        if (!userData) {
          return reply.code(404).send({ message: "User not found" });
        }

        // Return as JSON file
        reply.header(
          "Content-Disposition",
          `attachment; filename="trackcodex-export-${currentUser.username}.json"`,
        );
        return userData;
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Export failed" });
      }
    },
  );

  // Delete User Account
  fastify.delete(
    "/users/me",
    { preHandler: requireAuth },
    async (request, reply) => {
      const currentUser = (request as any).user;
      try {
        // Delete related data first (manual cascade if needed, though Prisma usually handles this)
        // Deleting the user should cascade to profile, posts, etc.
        await prisma.user.delete({
          where: { id: currentUser.userId },
        });

        // Clear session cookie
        reply.clearCookie("session_id", { path: "/" });

        return { success: true, message: "Account deleted successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Account deletion failed" });
      }
    },
  );

  // Get user profile by ID
  fastify.get("/users/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const currentUser = (request as any).user;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          name: true,
          email: false, // Don't expose email
          avatar: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              bio: true,
              location: true,
              website: true,
              company: true,
              followersCount: true,
              followingCount: true,
            },
          },
        },
      });

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      // Check if current user is following this user
      let isFollowing = false;
      if (currentUser) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: userId,
            },
          },
        });
        isFollowing = !!follow;
      }

      return {
        ...user,
        followers: user.profile?.followersCount || 0,
        following: user.profile?.followingCount || 0,
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        website: user.profile?.website || "",
        company: user.profile?.company || "",
        isFollowing,
      };
    } catch (error) {
      console.error("Get user profile error:", error);
      return reply.code(500).send({ message: "Failed to fetch user profile" });
    }
  });

  // Follow a user
  fastify.post("/users/:userId/follow", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const currentUser = (request as any).user;

    if (!currentUser) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    if (currentUser.id === userId) {
      return reply.code(400).send({ message: "Cannot follow yourself" });
    }

    try {
      // Check if already following
      const existing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: userId,
          },
        },
      });

      if (existing) {
        return reply.code(400).send({ message: "Already following this user" });
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: userId,
        },
      });

      // Update follower/following counts
      await prisma.profile.update({
        where: { userId },
        data: { followersCount: { increment: 1 } },
      });

      await prisma.profile.update({
        where: { userId: currentUser.id },
        data: { followingCount: { increment: 1 } },
      });

      return { success: true, message: "Successfully followed user" };
    } catch (error) {
      console.error("Follow error:", error);
      return reply.code(500).send({ message: "Failed to follow user" });
    }
  });

  // Unfollow a user
  fastify.delete("/users/:userId/follow", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const currentUser = (request as any).user;

    if (!currentUser) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    try {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: userId,
          },
        },
      });

      if (!follow) {
        return reply.code(404).send({ message: "Not following this user" });
      }

      // Delete follow relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: userId,
          },
        },
      });

      // Update counts
      await prisma.profile.update({
        where: { userId },
        data: { followersCount: { decrement: 1 } },
      });

      await prisma.profile.update({
        where: { userId: currentUser.id },
        data: { followingCount: { decrement: 1 } },
      });

      return { success: true, message: "Successfully unfollowed user" };
    } catch (error) {
      console.error("Unfollow error:", error);
      return reply.code(500).send({ message: "Failed to unfollow user" });
    }
  });

  // Get user's followers
  fastify.get("/users/:userId/followers", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    try {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return followers.map((f) => ({
        ...f.follower,
        profile: f.follower.profile,
      }));
    } catch (error) {
      console.error("Get followers error:", error);
      return reply.code(500).send({ message: "Failed to fetch followers" });
    }
  });

  // Get users that this user follows
  fastify.get("/users/:userId/following", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    try {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return following.map((f) => ({
        ...f.following,
        profile: f.following.profile,
      }));
    } catch (error) {
      console.error("Get following error:", error);
      return reply.code(500).send({ message: "Failed to fetch following" });
    }
  });

  // Search users
  fastify.get("/users/search", async (request, reply) => {
    const { q } = request.query as { q?: string };

    if (!q || q.length < 2) {
      return reply
        .code(400)
        .send({ message: "Query must be at least 2 characters" });
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { profile: true },
        take: 20,
      });

      return users;
    } catch (error) {
      console.error("Search error:", error);
      return reply.code(500).send({ message: "Search failed" });
    }
  });

  // Get trending users (most followers)
  fastify.get("/users/trending", async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true },
        orderBy: {
          profile: {
            followersCount: "desc",
          },
        },
        take: 10,
      });

      return users;
    } catch (error) {
      console.error("Trending users error:", error);
      return reply
        .code(500)
        .send({ message: "Failed to fetch trending users" });
    }
  });

  // Get suggested users (random for now, can be improved with ML)
  fastify.get("/users/suggested", async (request, reply) => {
    const currentUser = (request as any).user;

    try {
      // Get users the current user is NOT following
      const following = currentUser
        ? await prisma.follow.findMany({
            where: { followerId: currentUser.id },
            select: { followingId: true },
          })
        : [];

      const followingIds = following.map((f) => f.followingId);

      const users = await prisma.user.findMany({
        where: {
          id: {
            notIn: currentUser ? [...followingIds, currentUser.id] : [],
          },
        },
        include: { profile: true },
        take: 5,
        orderBy: {
          profile: {
            followersCount: "desc",
          },
        },
      });

      return users;
    } catch (error) {
      console.error("Suggested users error:", error);
      return reply
        .code(500)
        .send({ message: "Failed to fetch suggested users" });
    }
  });

  // Get User Activity
  fastify.get("/users/:userId/activity", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const { page, limit } = request.query as { page?: string; limit?: string };

    const pageNum = Math.max(1, parseInt(page || "1"));
    const limitNum = Math.min(50, parseInt(limit || "20"));
    const skip = (pageNum - 1) * limitNum;

    try {
      const [activities, total] = await Promise.all([
        prisma.activityLog.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: limitNum,
          skip,
        }),
        prisma.activityLog.count({ where: { userId } }),
      ]);

      // Map to frontend expectation
      // activityService expects { activities: [], total }
      const mapped = activities.map((a) => ({
        id: a.id,
        userId: a.userId,
        action: a.action,
        metadata: a.details,
        createdAt: a.createdAt,
      }));

      return { activities: mapped, total };
    } catch (error) {
      console.error("Activity fetch error:", error);
      return reply.code(500).send({ message: "Failed to fetch activity" });
    }
  });

  // Get User Activity Stats
  fastify.get("/users/:userId/activity/stats", async (request, reply) => {
    const { userId } = request.params as { userId: string };

    try {
      const stats = await prisma.activityLog.groupBy({
        by: ["action"],
        where: { userId },
        _count: {
          action: true,
        },
      });

      // Transform to { ACTION_NAME: count }
      const result: Record<string, number> = {};
      stats.forEach((s) => {
        result[s.action] = s._count.action;
      });

      return result;
    } catch (error) {
      console.error("Activity stats error:", error);
      return reply
        .code(500)
        .send({ message: "Failed to fetch activity stats" });
    }
  });
}
