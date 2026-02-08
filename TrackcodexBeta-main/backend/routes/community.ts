import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/auth";

const prisma = new PrismaClient();

export async function communityRoutes(fastify: FastifyInstance) {
  // List Posts
  fastify.get<{
    Querystring: { type?: string; limit?: string; communityId?: string };
  }>("/community/posts", async (request, reply) => {
    const { type, limit, communityId } = request.query;
    const take = limit ? parseInt(limit) : 20;

    const where: any = {};
    if (type && type !== "all") {
      where.type = type;
    }
    if (communityId) {
      where.communityId = communityId;
    }

    try {
      const posts = await prisma.communityPost.findMany({
        where,
        take,
        include: {
          author: {
            select: { id: true, name: true, avatar: true, role: true },
          },
          community: {
            select: { id: true, name: true, slug: true, avatar: true },
          },
          workspace: {
            select: { id: true, name: true, description: true },
          },
          comments: {
            include: {
              author: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: "asc" },
          },
          likedBy: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return posts.map((p) => ({
        ...p,
        likes: p.likes,
      }));
    } catch (error) {
      console.error("Fetch posts error:", error);
      return reply.code(500).send({ message: "Failed to fetch posts" });
    }
  });

  // --- Community Management ---

  // Create Community
  fastify.post<{
    Body: { name: string; description?: string; avatar?: string };
  }>("/community", { preHandler: requireAuth }, async (request, reply) => {
    const { name, description, avatar } = request.body;
    const currentUser = (request as any).user;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const community = await prisma.community.create({
        data: {
          name,
          slug,
          description,
          avatar,
          creatorId: currentUser.id,
          members: {
            create: { userId: currentUser.id, role: "ADMIN" },
          },
        },
      });
      return community;
    } catch (error) {
      console.error("Create community error:", error);
      return reply.code(500).send({ message: "Failed to create community" });
    }
  });

  // Get Community by Slug
  fastify.get<{ Params: { slug: string } }>(
    "/community/:slug",
    async (request, reply) => {
      const { slug } = request.params;
      try {
        const community = await prisma.community.findUnique({
          where: { slug },
          include: {
            _count: { select: { members: true, posts: true } },
            members: {
              take: 5,
              include: {
                user: { select: { id: true, name: true, avatar: true } },
              },
            },
          },
        });
        if (!community)
          return reply.code(404).send({ message: "Community not found" });
        return community;
      } catch (error) {
        console.error("Get community error:", error);
        return reply.code(500).send({ message: "Failed to get community" });
      }
    },
  );

  // Join Community
  fastify.post<{ Params: { slug: string } }>(
    "/community/:slug/join",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { slug } = request.params;
      const currentUser = (request as any).user;

      try {
        const community = await prisma.community.findUnique({
          where: { slug },
        });
        if (!community)
          return reply.code(404).send({ message: "Community not found" });

        const member = await prisma.communityMember.create({
          data: {
            communityId: community.id,
            userId: currentUser.id,
          },
        });
        return member;
      } catch (error) {
        // Unique constraint means already joined
        return reply.code(400).send({ message: "Already a member" });
      }
    },
  );

  // Create Post
  fastify.post<{
    Body: {
      title?: string;
      content: string;
      type?: string;
      repoLink?: any;
      codeSnippet?: any;
      jobDetails?: any;
      communityId?: string;
      workspaceId?: string;
      researchPaperUrl?: string;
    };
  }>(
    "/community/posts",
    { preHandler: requireAuth },
    async (request, reply) => {
      const {
        title,
        content,
        type,
        repoLink,
        codeSnippet,
        jobDetails,
        communityId,
        workspaceId,
        researchPaperUrl,
      } = request.body;
      const currentUser = (request as any).user;

      try {
        const post = await prisma.communityPost.create({
          data: {
            title,
            content,
            type: type || "discussion",
            authorId: currentUser.id,
            repoLink: repoLink || undefined,
            codeSnippet: codeSnippet || undefined,
            jobDetails: jobDetails || undefined,
            communityId: communityId || undefined,
            workspaceId: workspaceId || undefined,
            researchPaperUrl: researchPaperUrl || undefined,
          },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        });

        return post;
      } catch (error) {
        console.error("Create post error:", error);
        return reply.code(500).send({ message: "Failed to create post" });
      }
    },
  );

  // Add Comment
  fastify.post<{ Params: { id: string }; Body: { text: string } }>(
    "/community/posts/:id/comments",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;
      const { text } = request.body;
      const currentUser = (request as any).user;

      try {
        const comment = await prisma.communityComment.create({
          data: {
            postId: id,
            text,
            authorId: currentUser.id,
          },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
        });

        return comment;
      } catch (error) {
        console.error("Add comment error:", error);
        return reply.code(500).send({ message: "Failed to add comment" });
      }
    },
  );

  // Toggle Like
  fastify.post<{ Params: { id: string } }>(
    "/community/posts/:id/like",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params;
      const currentUser = (request as any).user;

      try {
        // Check if already liked
        const existing = await prisma.communityPostLike.findUnique({
          where: {
            postId_userId: {
              postId: id,
              userId: currentUser.id,
            },
          },
        });

        if (existing) {
          // Unlike
          await prisma.communityPostLike.delete({
            where: { id: existing.id },
          });
          await prisma.communityPost.update({
            where: { id },
            data: { likes: { decrement: 1 } },
          });
          return { liked: false };
        } else {
          // Like
          await prisma.communityPostLike.create({
            data: {
              postId: id,
              userId: currentUser.id,
            },
          });
          await prisma.communityPost.update({
            where: { id },
            data: { likes: { increment: 1 } },
          });
          return { liked: true };
        }
      } catch (error) {
        console.error("Like error:", error);
        return reply.code(500).send({ message: "Failed to toggle like" });
      }
    },
  );
}
