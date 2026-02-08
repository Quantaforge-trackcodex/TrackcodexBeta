import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireRepoPermission } from "../middleware/repoAuth";
import { RepoLevel } from "../services/iamService";
import { CollaborationService } from "../services/collaborationService";
import { SCMService } from "../services/scmService";

const prisma = new PrismaClient();

/**
 * Collaboration API: Issues & Pull Requests
 * Matches GitHub Enterprise parity for repository collaboration.
 */
export async function collaborationRoutes(fastify: FastifyInstance) {
  // --- Issues ---

  /*
  // List Issues
  fastify.get(
    "/repositories/:id/issues",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await prisma.issue.findMany({
        where: { repoId },
        include: { author: true, labels: true, milestone: true },
        orderBy: { number: "desc" },
      });
    },
  );
  */

  // Sync Issues from QuantaLab
  fastify.post(
    "/repositories/:id/issues/sync",
    { preHandler: requireRepoPermission(RepoLevel.ADMIN) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await SCMService.syncIssues(repoId);
    },
  );

  /*
  // Create Issue
  fastify.post(
    "/repositories/:id/issues",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const body = request.body as {
        title: string;
        body?: string;
        labelIds?: string[];
        milestoneId?: string;
      };
      const user = request.user!;

      const issue = await CollaborationService.createIssue({
        repoId,
        authorId: user.userId,
        title: body.title,
        body: body.body,
        labelIds: body.labelIds,
        milestoneId: body.milestoneId,
      });

      return reply.code(201).send(issue);
    },
  );
  */

  // --- Pull Requests ---

  /*
  // List PRs
  fastify.get(
    "/repositories/:id/pulls",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await prisma.pullRequest.findMany({
        where: { repoId },
        include: { author: true, labels: true },
        orderBy: { number: "desc" },
      });
    },
  );
  */

  // Sync PRs from QuantaLab
  fastify.post(
    "/repositories/:id/pulls/sync",
    { preHandler: requireRepoPermission(RepoLevel.ADMIN) },
    async (request) => {
      const { id: repoId } = request.params as { id: string };
      return await SCMService.syncPullRequests(repoId);
    },
  );

  /*
  // Create Pull Request
  fastify.post(
    "/repositories/:id/pulls",
    { preHandler: requireRepoPermission(RepoLevel.WRITE) },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const body = request.body as {
        title: string;
        body?: string;
        base: string;
        head: string;
        draft?: boolean;
      };
      const user = request.user!;

      const pr = await CollaborationService.createPullRequest({
        repoId,
        authorId: user.userId,
        title: body.title,
        body: body.body,
        base: body.base,
        head: body.head,
        draft: body.draft,
      });

      return reply.code(201).send(pr);
    },
  );
  */

  // --- Comments ---

  // Add Comment to Issue
  fastify.post("/issues/:issueId/comments", async (request, reply) => {
    const { issueId } = request.params as { issueId: string };
    const { body } = request.body as { body: string };
    const user = request.user!;

    const comment = await CollaborationService.addComment({
      authorId: user.userId,
      body,
      issueId,
    });

    return reply.send(comment);
  });
}
