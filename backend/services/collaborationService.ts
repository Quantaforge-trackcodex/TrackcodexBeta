import { PrismaClient } from "@prisma/client";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

/**
 * Integravity Collaboration Service: Issues, PRs, Comments & Labels
 * Matches GitHub Enterprise behavior for repository collaboration.
 */
export class CollaborationService {
  /**
   * Create a new Issue with repo-relative numbering.
   */
  static async createIssue(data: {
    repoId: string;
    authorId: string;
    title: string;
    body?: string;
    labelIds?: string[];
    milestoneId?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Calculate next issue number for this repo
      const lastIssue = await tx.issue.findFirst({
        where: { repoId: data.repoId },
        orderBy: { number: "desc" },
      });
      const nextNumber = (lastIssue?.number || 0) + 1;

      // 2. Create the issue
      const issue = await tx.issue.create({
        data: {
          number: nextNumber,
          repoId: data.repoId,
          authorId: data.authorId,
          title: data.title,
          body: data.body,
          milestoneId: data.milestoneId,
          labels: data.labelIds
            ? { connect: data.labelIds.map((id) => ({ id })) }
            : undefined,
        },
      });

      // 3. Audit Log
      await AuditService.log({
        actorId: data.authorId,
        action: "ISSUE_CREATE",
        resource: `repo:${data.repoId}/issue:${issue.id}`,
        details: { number: issue.number, title: issue.title },
      });

      return issue;
    });
  }

  /**
   * Create a Pull Request with repo-relative numbering.
   */
  static async createPullRequest(data: {
    repoId: string;
    authorId: string;
    title: string;
    body?: string;
    base: string;
    head: string;
    draft?: boolean;
  }) {
    return await prisma.$transaction(async (tx) => {
      const lastPR = await tx.pullRequest.findFirst({
        where: { repoId: data.repoId },
        orderBy: { number: "desc" },
      });
      const nextNumber = (lastPR?.number || 0) + 1;

      const pr = await tx.pullRequest.create({
        data: {
          number: nextNumber,
          repoId: data.repoId,
          authorId: data.authorId,
          title: data.title,
          body: data.body,
          base: data.base,
          head: data.head,
          draft: data.draft || false,
        },
      });

      await AuditService.log({
        actorId: data.authorId,
        action: "PR_CREATE",
        resource: `repo:${data.repoId}/pr:${pr.id}`,
        details: { number: pr.number, title: pr.title },
      });

      return pr;
    });
  }

  /**
   * Add a comment to an Issue or PR.
   */
  static async addComment(data: {
    authorId: string;
    body: string;
    issueId?: string;
    pullRequestId?: string;
  }) {
    const comment = await prisma.comment.create({
      data: {
        authorId: data.authorId,
        body: data.body,
        issueId: data.issueId,
        pullRequestId: data.pullRequestId,
      },
    });

    return comment;
  }

  /**
   * Handle PR State Transitions (GitHub Parity)
   */
  static async updatePRStatus(
    prId: string,
    status: "OPEN" | "CLOSED" | "MERGED",
    actorId: string,
  ) {
    const pr = await prisma.pullRequest.update({
      where: { id: prId },
      data: { status },
    });

    await AuditService.log({
      actorId,
      action: "PR_STATUS_CHANGE",
      resource: `pr:${prId}`,
      details: { status },
    });

    return pr;
  }
}
