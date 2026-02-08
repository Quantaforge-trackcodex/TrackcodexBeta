import { prisma } from "../lib/prisma";

export const IssueService = {
  /**
   * Create a new issue
   */
  async createIssue(
    repoId: string,
    title: string,
    body: string | null,
    authorId: string,
    assigneeIds?: string[],
    labelIds?: string[],
    milestoneId?: string,
  ) {
    // Get next issue number for this repo
    const lastIssue = await prisma.issue.findFirst({
      where: { repoId },
      orderBy: { number: "desc" },
    });
    const number = (lastIssue?.number || 0) + 1;

    const issue = await prisma.issue.create({
      data: {
        repoId,
        number,
        title,
        body,
        authorId,
        milestoneId,
        labels: labelIds
          ? { connect: labelIds.map((id) => ({ id })) }
          : undefined,
        assignees: assigneeIds
          ? {
              create: assigneeIds.map((userId) => ({
                userId,
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
      },
    });

    return issue;
  },

  /**
   * Get issue by ID with all relations
   */
  async getIssue(issueId: string) {
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        author: true,
        repo: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
        closedByUser: true,
      },
    });

    return issue;
  },

  /**
   * List issues with filters
   */
  async listIssues(
    repoId: string,
    filters?: {
      status?: string;
      assignee?: string;
      label?: string;
      milestone?: string;
    },
  ) {
    const where: any = { repoId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.assignee) {
      where.assignees = {
        some: { userId: filters.assignee },
      };
    }

    if (filters?.label) {
      where.labels = {
        some: { id: filters.label },
      };
    }

    if (filters?.milestone) {
      where.milestoneId = filters.milestone;
    }

    const issues = await prisma.issue.findMany({
      where,
      include: {
        author: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return issues;
  },

  /**
   * Update issue
   */
  async updateIssue(
    issueId: string,
    updates: {
      title?: string;
      body?: string;
      milestoneId?: string | null;
    },
  ) {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: updates,
      include: {
        author: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
      },
    });

    return issue;
  },

  /**
   * Close issue
   */
  async closeIssue(
    issueId: string,
    userId: string,
    stateReason: "completed" | "not_planned",
  ) {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
        closedBy: userId,
        stateReason,
      },
      include: {
        author: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
        closedByUser: true,
      },
    });

    return issue;
  },

  /**
   * Reopen issue
   */
  async reopenIssue(issueId: string) {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        status: "OPEN",
        closedAt: null,
        closedBy: null,
        stateReason: "reopened",
      },
      include: {
        author: true,
        assignees: { include: { user: true } },
        labels: true,
        milestone: true,
      },
    });

    return issue;
  },

  /**
   * Add assignee to issue
   */
  async addAssignee(issueId: string, userId: string) {
    const assignee = await prisma.issueAssignee.create({
      data: {
        issueId,
        userId,
      },
      include: {
        user: true,
        issue: true,
      },
    });

    return assignee;
  },

  /**
   * Remove assignee from issue
   */
  async removeAssignee(issueId: string, userId: string) {
    await prisma.issueAssignee.deleteMany({
      where: {
        issueId,
        userId,
      },
    });

    return { success: true };
  },

  /**
   * Add label to issue
   */
  async addLabel(issueId: string, labelId: string) {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        labels: {
          connect: { id: labelId },
        },
      },
      include: {
        labels: true,
      },
    });

    return issue;
  },

  /**
   * Remove label from issue
   */
  async removeLabel(issueId: string, labelId: string) {
    const issue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        labels: {
          disconnect: { id: labelId },
        },
      },
      include: {
        labels: true,
      },
    });

    return issue;
  },

  // ========== MILESTONE METHODS ==========

  /**
   * Create milestone
   */
  async createMilestone(
    repoId: string,
    title: string,
    description?: string,
    dueDate?: Date,
  ) {
    const milestone = await prisma.milestone.create({
      data: {
        repoId,
        title,
        description,
        dueDate,
      },
      include: {
        repo: true,
        _count: { select: { issues: true } },
      },
    });

    return milestone;
  },

  /**
   * List milestones
   */
  async listMilestones(repoId: string, status?: string) {
    const where: any = { repoId };
    if (status) {
      where.state = status;
    }

    const milestones = await prisma.milestone.findMany({
      where,
      include: {
        _count: { select: { issues: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return milestones;
  },

  /**
   * Update milestone
   */
  async updateMilestone(
    milestoneId: string,
    updates: {
      title?: string;
      description?: string;
      dueDate?: Date | null;
    },
  ) {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: updates,
      include: {
        _count: { select: { issues: true } },
      },
    });

    return milestone;
  },

  /**
   * Close milestone
   */
  async closeMilestone(milestoneId: string) {
    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        state: "CLOSED",
      },
      include: {
        _count: { select: { issues: true } },
      },
    });

    return milestone;
  },
};
