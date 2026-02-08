import { prisma } from "../lib/prisma";

export const DiscussionService = {
  /**
   * Create a new discussion
   */
  async createDiscussion(
    repoId: string,
    authorId: string,
    title: string,
    body: string,
    category: "Q&A" | "IDEAS" | "GENERAL" | "ANNOUNCEMENTS" = "GENERAL",
  ) {
    // Get next discussion number for this repo
    const lastDiscussion = await prisma.discussion.findFirst({
      where: { repoId },
      orderBy: { number: "desc" },
    });
    const number = (lastDiscussion?.number ?? 0) + 1;

    const discussion = await prisma.discussion.create({
      data: {
        repoId,
        authorId,
        number,
        title,
        body,
        category,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return discussion;
  },

  /**
   * List discussions for a repository
   */
  async listDiscussions(
    repoId: string,
    filters?: { category?: string; authorId?: string },
  ) {
    const where: any = { repoId };
    if (filters?.category) where.category = filters.category;
    if (filters?.authorId) where.authorId = filters.authorId;

    const discussions = await prisma.discussion.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return discussions;
  },

  /**
   * Get a single discussion with its threaded comments
   */
  async getDiscussion(repoId: string, number: number) {
    const discussion = await prisma.discussion.findUnique({
      where: {
        repoId_number: { repoId, number },
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        comments: {
          where: { parentId: null }, // Only top-level comments first
          include: {
            author: {
              select: { id: true, username: true, name: true, avatar: true },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    avatar: true,
                  },
                },
                reactions: true,
              },
            },
            reactions: true,
          },
          orderBy: { createdAt: "asc" },
        },
        reactions: true,
        answer: {
          include: {
            author: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return discussion;
  },

  /**
   * Add a comment (or reply) to a discussion
   */
  async addComment(
    discussionId: string,
    authorId: string,
    body: string,
    parentId?: string,
  ) {
    const comment = await prisma.discussionComment.create({
      data: {
        discussionId,
        authorId,
        body,
        parentId,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    return comment;
  },

  /**
   * Mark a comment as the answer (for Q&A)
   */
  async markAnswer(discussionId: string, commentId: string) {
    // Verify comment belongs to discussion
    const comment = await prisma.discussionComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.discussionId !== discussionId) {
      throw new Error("Comment does not belong to this discussion");
    }

    const discussion = await prisma.discussion.update({
      where: { id: discussionId },
      data: {
        answerId: commentId,
      },
      include: {
        answer: true,
      },
    });

    return discussion;
  },

  /**
   * Add or toggle a reaction
   */
  async toggleReaction(
    userId: string,
    emoji: string,
    target: { discussionId?: string; commentId?: string },
  ) {
    const where: any = { userId, emoji };
    if (target.discussionId) where.discussionId = target.discussionId;
    else if (target.commentId) where.commentId = target.commentId;

    const existing = await prisma.discussionReaction.findFirst({ where });

    if (existing) {
      await prisma.discussionReaction.delete({
        where: { id: existing.id },
      });
      return { action: "removed" };
    } else {
      const reaction = await prisma.discussionReaction.create({
        data: {
          userId,
          emoji,
          ...target,
        },
      });
      return { action: "added", reaction };
    }
  },

  /**
   * Update a discussion
   */
  async updateDiscussion(
    discussionId: string,
    updates: {
      title?: string;
      body?: string;
      category?: string;
      locked?: boolean;
    },
  ) {
    return await prisma.discussion.update({
      where: { id: discussionId },
      data: updates,
    });
  },

  /**
   * Delete a discussion
   */
  async deleteDiscussion(discussionId: string) {
    return await prisma.discussion.delete({
      where: { id: discussionId },
    });
  },
};
