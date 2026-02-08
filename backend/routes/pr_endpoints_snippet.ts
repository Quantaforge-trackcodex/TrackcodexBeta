// Pull Request API Endpoints
// Add these to backend/routes/repositories.ts before the closing }

// List Pull Requests
fastify.get(
  "/repositories/:id/pulls",
  { preHandler: requireAuth },
  async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.query as { status?: string };

    try {
      const { PullRequestService } =
        await import("../services/pullRequestService");
      const prs = await PullRequestService.listPullRequests(id, status);
      return prs;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError("Failed to fetch pull requests");
    }
  },
);

// Create Pull Request
fastify.post(
  "/repositories/:id/pulls",
  { preHandler: requireRepoCapability("read_repo") },
  async (request, reply) => {
    const { id: repoId } = request.params as { id: string };
    const user = request.user!;
    const { base, head, title, body, draft } = request.body as {
      base: string;
      head: string;
      title: string;
      body?: string;
      draft?: boolean;
    };

    if (!base || !head || !title) {
      throw BadRequest("base, head, and title are required");
    }

    try {
      const { PullRequestService } =
        await import("../services/pullRequestService");
      const pr = await PullRequestService.createPullRequest(
        repoId,
        base,
        head,
        title,
        body || null,
        user.userId,
        draft || false,
      );

      // Audit Log
      await AuditService.log({
        enterpriseId: undefined,
        actorId: user.userId,
        action: "PR_CREATE",
        resource: `repo:${repoId}/pr:${pr.number}`,
        details: { title, base, head },
        ipAddress: request.ip,
      });

      return pr;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError(e.message || "Failed to create pull request");
    }
  },
);

// Get Pull Request Details
fastify.get(
  "/repositories/:id/pulls/:number",
  { preHandler: requireAuth },
  async (request, reply) => {
    const { id: repoId, number } = request.params as {
      id: string;
      number: string;
    };

    try {
      const pr = await prisma.pullRequest.findUnique({
        where: {
          repoId_number: {
            repoId,
            number: parseInt(number),
          },
        },
        include: {
          author: true,
          repo: true,
          reviews: {
            include: { reviewer: true },
            orderBy: { createdAt: "desc" },
          },
          comments: {
            include: { author: true },
            orderBy: { createdAt: "asc" },
          },
          labels: true,
        },
      });

      if (!pr) throw NotFound("Pull request not found");
      return pr;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError("Failed to fetch pull request");
    }
  },
);

// Get PR Diff
fastify.get(
  "/repositories/:id/pulls/:number/diff",
  { preHandler: requireAuth },
  async (request, reply) => {
    const { id: repoId, number } = request.params as {
      id: string;
      number: string;
    };

    try {
      const pr = await prisma.pullRequest.findUnique({
        where: {
          repoId_number: {
            repoId,
            number: parseInt(number),
          },
        },
      });

      if (!pr) throw NotFound("Pull request not found");

      const { PullRequestService } =
        await import("../services/pullRequestService");
      const diff = await PullRequestService.getDiff(repoId, pr.base, pr.head);

      return { diff };
    } catch (e: any) {
      request.log.error(e);
      throw InternalError("Failed to fetch diff");
    }
  },
);

// Merge Pull Request
fastify.post(
  "/repositories/:id/pulls/:number/merge",
  { preHandler: requireRepoCapability("administer_repo") },
  async (request, reply) => {
    const { id: repoId, number } = request.params as {
      id: string;
      number: string;
    };
    const user = request.user!;
    const { method } = request.body as {
      method?: "merge" | "squash" | "rebase";
    };

    try {
      const pr = await prisma.pullRequest.findUnique({
        where: {
          repoId_number: {
            repoId,
            number: parseInt(number),
          },
        },
      });

      if (!pr) throw NotFound("Pull request not found");

      const { PullRequestService } =
        await import("../services/pullRequestService");
      const merged = await PullRequestService.mergePullRequest(
        pr.id,
        user.userId,
        method || "merge",
      );

      // Audit Log
      await AuditService.log({
        enterpriseId: undefined,
        actorId: user.userId,
        action: "PR_MERGE",
        resource: `repo:${repoId}/pr:${number}`,
        details: { method: method || "merge" },
        ipAddress: request.ip,
      });

      return merged;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError(e.message || "Failed to merge pull request");
    }
  },
);

// Close Pull Request
fastify.post(
  "/repositories/:id/pulls/:number/close",
  { preHandler: requireRepoCapability("administer_repo") },
  async (request, reply) => {
    const { id: repoId, number } = request.params as {
      id: string;
      number: string;
    };
    const user = request.user!;

    try {
      const pr = await prisma.pullRequest.findUnique({
        where: {
          repoId_number: {
            repoId,
            number: parseInt(number),
          },
        },
      });

      if (!pr) throw NotFound("Pull request not found");

      const { PullRequestService } =
        await import("../services/pullRequestService");
      const closed = await PullRequestService.closePullRequest(pr.id);

      // Audit Log
      await AuditService.log({
        enterpriseId: undefined,
        actorId: user.userId,
        action: "PR_CLOSE",
        resource: `repo:${repoId}/pr:${number}`,
        details: {},
        ipAddress: request.ip,
      });

      return closed;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError("Failed to close pull request");
    }
  },
);

// Add Review
fastify.post(
  "/repositories/:id/pulls/:number/reviews",
  { preHandler: requireAuth },
  async (request, reply) => {
    const { id: repoId, number } = request.params as {
      id: string;
      number: string;
    };
    const user = request.user!;
    const { status, body } = request.body as {
      status: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED";
      body?: string;
    };

    if (!status) throw BadRequest("status is required");

    try {
      const pr = await prisma.pullRequest.findUnique({
        where: {
          repoId_number: {
            repoId,
            number: parseInt(number),
          },
        },
      });

      if (!pr) throw NotFound("Pull request not found");

      const { PullRequestService } =
        await import("../services/pullRequestService");
      const review = await PullRequestService.addReview(
        pr.id,
        user.userId,
        status,
        body,
      );

      // Audit Log
      await AuditService.log({
        enterpriseId: undefined,
        actorId: user.userId,
        action: "PR_REVIEW",
        resource: `repo:${repoId}/pr:${number}`,
        details: { status },
        ipAddress: request.ip,
      });

      return review;
    } catch (e: any) {
      request.log.error(e);
      throw InternalError("Failed to add review");
    }
  },
);
