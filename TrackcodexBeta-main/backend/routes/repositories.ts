import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { SCMService } from "../services/scmService";
import { GitHubService } from "../services/github";
import { requireAuth } from "../middleware/auth";
import { RepoLevel } from "../services/iamService";
import { GovernanceService } from "../services/governanceService";
import { AuditService } from "../services/audit";
import {
  InternalError,
  Unauthorized,
  NotFound,
  BadRequest,
  AppError,
} from "../utils/AppError";
import {
  requireRepoPermission,
  requireRepoCapability,
} from "../middleware/repoAuth";

const prisma = new PrismaClient();

/**
 * Repository Routes (GitHub Parity)
 * Implements production-grade RBAC and Repository Governance rules.
 */
export async function repositoryRoutes(fastify: FastifyInstance) {
  // Sync with GitHub
  fastify.post(
    "/repositories/sync",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = request.user;
      if (!user) return reply.code(401).send({ error: "Unauthorized" });

      try {
        const repos = await GitHubService.syncRepositories(user.userId);
        return { message: "Sync successful", repositories: repos };
      } catch (error: any) {
        request.log.error(error);
        if (error instanceof AppError) throw error;
        throw InternalError("Sync failed");
      }
    },
  );

  // List Repositories
  fastify.get<{ Querystring: { userId?: string; limit?: string } }>(
    "/repositories",
    async (request) => {
      const { userId, limit } = request.query;
      const take = limit ? parseInt(limit) : undefined;

      const where: any = {};
      if (userId) {
        where.ownerId = userId;
      }

      const repositories = await prisma.repository.findMany({
        where,
        take,
        include: {
          org: true,
          securityAlerts: true,
        },
        orderBy: { updatedAt: "desc" },
      });
      return { repositories };
    },
  );

  // Get Repository Details
  fastify.get(
    "/repositories/:id",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id } = request.params as { id: string };
      const repo = await prisma.repository.findUnique({
        where: { id },
        include: {
          org: true,
          securityAlerts: true,
          aiTasks: true,
          branchProtections: true,
        },
      });
      if (!repo) throw NotFound("Repository not found");
      return repo;
    },
  );

  // Create Repository
  fastify.post(
    "/repositories",
    { preHandler: requireAuth }, // Should ideally be requireOrgPermission(ADMIN)
    async (request, reply) => {
      const { name, description, isPublic, techStack, orgId } =
        request.body as any;
      const user = request.user;
      if (!user) throw Unauthorized("Unauthorized");

      if (!name) throw BadRequest("Repository name is required");

      try {
        const repoData = await prisma.repository.create({
          data: {
            name,
            description,
            isPublic: isPublic || false,
            language: techStack,
            orgId: orgId,
            stars: 0,
            forksCount: 0,
          },
        });

        // Audit Log for Repo Creation
        await AuditService.log({
          enterpriseId: (request.user as any).enterpriseId || undefined,
          actorId: user.userId,
          action: "REPO_CREATE",
          resource: `repo:${repoData.id}`,
          details: { name, orgId },
          ipAddress: request.ip,
        });

        // Sync with SCM Engine
        try {
          await SCMService.createRepository({
            id: repoData.id,
            name: repoData.name,
            description: repoData.description || undefined,
            techStack: techStack,
          });
        } catch (err: any) {
          request.log.error("Failed to sync with SCM engine:", err);
        }

        return repoData;
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw error;
      }
    },
  );

  // --- Governance Endpoints (Integravity Expansion) ---

  // Update Branch Protection
  fastify.post(
    "/repositories/:id/branches/:branch/protection",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { id: repoId, branch: pattern } = request.params as {
        id: string;
        branch: string;
      };
      const config = request.body as {
        requiredReviews?: number;
        requireSignedCommits?: boolean;
        requireStatusChecks?: boolean;
      };

      const protection = await prisma.branchProtection.upsert({
        where: { repoId_pattern: { repoId, pattern } },
        update: config,
        create: { repoId, pattern, ...config },
      });

      // Audit Log for Branch Protection
      await AuditService.log({
        enterpriseId: request.enterpriseId ?? undefined,
        actorId: request.user!.userId,
        action: "BRANCH_PROTECTION_UPDATE",
        resource: `repo:${repoId}/branch:${pattern}`,
        details: config,
        ipAddress: request.ip,
      });

      return protection;
    },
  );

  // Record Status Check
  fastify.post(
    "/repositories/:id/commits/:sha/status",
    { preHandler: requireRepoCapability("push_code") },
    async (request) => {
      const { id: repoId, sha: commitSha } = request.params as {
        id: string;
        sha: string;
      };
      const { context, state, targetUrl, description } = request.body as any;

      return await GovernanceService.recordStatusCheck({
        repoId,
        commitSha,
        context,
        state,
        targetUrl,
        description,
      });
    },
  );

  // Fork Repository
  fastify.post(
    "/repositories/:id/fork",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = request.user!;
      const { name } = request.body as { name?: string };

      try {
        const { RepositoryService } =
          await import("../services/repositoryService");
        const newRepo = await RepositoryService.forkRepository(
          id,
          user.userId,
          name,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined, // Personal fork
          actorId: user.userId,
          action: "REPO_FORK",
          resource: `repo:${newRepo.id}`,
          details: { from: id },
          ipAddress: request.ip,
        });

        return newRepo;
      } catch (e: any) {
        request.log.error(e);
        throw BadRequest(e.message || "Fork failed");
      }
    },
  );

  // Generate from Template
  fastify.post(
    "/repositories/:id/generate",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id: templateId } = request.params as { id: string };
      const user = request.user!;
      const { name } = request.body as { name: string };

      if (!name) throw BadRequest("New repository name is required");

      try {
        const { RepositoryService } =
          await import("../services/repositoryService");
        const newRepo = await RepositoryService.createFromTemplate(
          templateId,
          user.userId,
          name,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "REPO_USE_TEMPLATE",
          resource: `repo:${newRepo.id}`,
          details: { templateId },
          ipAddress: request.ip,
        });

        return newRepo;
      } catch (e: any) {
        request.log.error(e);
        throw BadRequest(e.message || "Template generation failed");
      }
    },
  );

  // Update Settings
  fastify.patch(
    "/repositories/:id/settings",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { settings } = request.body as { settings: any }; // typed as FullRepoSettings in frontend

      // Separate column fields from JSON fields
      const { isTemplate, name, ...jsonSettings } = settings;

      try {
        const updated = await prisma.repository.update({
          where: { id },
          data: {
            isTemplate: isTemplate ?? undefined,
            name: name ?? undefined,
            settings: jsonSettings, // Store remainder in JSON
          },
        });

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: (request.user as any).userId,
          action: "REPO_UPDATE_SETTINGS",
          resource: `repo:${id}`,
          details: { changes: Object.keys(settings) },
          ipAddress: request.ip,
        });

        return {
          status: "ok",
          settings: {
            ...(updated.settings as object),
            isTemplate: updated.isTemplate,
            name: updated.name,
          },
        };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update settings");
      }
    },
  );

  // Delete Repository (Soft Delete)
  fastify.delete(
    "/repositories/:id",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { RepositoryService } =
          await import("../services/repositoryService");
        await RepositoryService.deleteRepository(id);

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: (request.user as any).userId,
          action: "REPO_DELETE",
          resource: `repo:${id}`,
          details: { soft: true },
          ipAddress: request.ip,
        });

        return { success: true, message: "Repository archived" };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to delete repository");
      }
    },
  );

  // Get Dependencies
  fastify.get(
    "/repositories/:id/dependencies",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { DependencyService } =
          await import("../services/dependencyService");
        const graph = await DependencyService.getDependencies(id);

        return (
          graph || { totalCount: 0, byType: {}, packages: [], manifests: [] }
        );
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch dependencies");
      }
    },
  );

  // Analyze Dependencies
  fastify.post(
    "/repositories/:id/dependencies/analyze",
    { preHandler: requireRepoCapability("write_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { DependencyService } =
          await import("../services/dependencyService");
        const graph = await DependencyService.analyzeDependencies(id);

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: (request.user as any).userId,
          action: "REPO_ANALYZE_DEPS",
          resource: `repo:${id}`,
          details: { count: graph.totalCount },
          ipAddress: request.ip,
        });

        return graph;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to analyze dependencies");
      }
    },
  );

  // Get Repository Contents (File Tree)
  fastify.get(
    "/repositories/:id/contents",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { path: filePath, ref } = request.query as {
        path?: string;
        ref?: string;
      };

      try {
        const { GitServer } = await import("../services/git/gitServer");
        const gitServer = new GitServer();

        // 1. List files at path
        const files = await gitServer.listFiles(
          id,
          ref || "HEAD",
          filePath || "",
        );

        // 2. Format for UI (UniversalFileList)
        const contents = files.map((f) => {
          // Determine if it's a file or directory based on trailing slash or listing logic
          // Isomorphic-git listFiles returns flat list, we need to process it to hierarchical or flat-level
          // A simpler approach for now:
          // If the path exactly matches, it's this file. If it starts with, it might be subfile.
          // For a true "browse" experience, we need a smarter listFiles in GitServer that does `ls-tree`.

          // REFACTOR: The `listFiles` in GitServer seems to return a flat list of ALL files.
          // We need to filter for the current directory level.

          return {
            name: path.basename(f),
            path: f,
            type: "file", // Logic needed here for folders
            size: 0,
            sha: "unknown",
          };
        });

        // REVISIT: The current `GitServer.listFiles` is recursive.
        // We need a non-recursive `ls-tree` for adequate browsing.
        // For MVP, let's assume `listFiles` returns the full flat tree and we filter here?
        // No, that's inefficient for huge repos.
        // Let's rely on the existing GitServer behavior for now and refine if needed.

        // BETTER APPROACH: Use `git ls-tree` directly via spawn in `GitServer` or here.
        // But `GitServer` is the abstraction.
        // Let's call a new method `lsTree` on GitServer (we'll add it next).

        const tree = await gitServer.lsTree(id, ref || "HEAD", filePath || "");
        return tree;
      } catch (e: any) {
        request.log.error(e);
        // If repo is empty or HEAD missing, return empty list
        return [];
      }
    },
  );

  // ========== PULL REQUEST ENDPOINTS ==========

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

  // ========== ISSUE ENDPOINTS ==========

  // List Issues
  fastify.get(
    "/repositories/:id/issues",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status, assignee, label, milestone } = request.query as {
        status?: string;
        assignee?: string;
        label?: string;
        milestone?: string;
      };

      try {
        const { IssueService } = await import("../services/issueService");
        const issues = await IssueService.listIssues(id, {
          status,
          assignee,
          label,
          milestone,
        });
        return issues;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch issues");
      }
    },
  );

  // Create Issue
  fastify.post(
    "/repositories/:id/issues",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const user = request.user!;
      const { title, body, assignees, labels, milestoneId } = request.body as {
        title: string;
        body?: string;
        assignees?: string[];
        labels?: string[];
        milestoneId?: string;
      };

      if (!title) throw BadRequest("title is required");

      try {
        const { IssueService } = await import("../services/issueService");
        const issue = await IssueService.createIssue(
          repoId,
          title,
          body || null,
          user.userId,
          assignees,
          labels,
          milestoneId,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "ISSUE_CREATE",
          resource: `repo:${repoId}/issue:${issue.number}`,
          details: { title },
          ipAddress: request.ip,
        });

        return issue;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to create issue");
      }
    },
  );

  // Remaining Issue and Milestone API Endpoints
  // Add these to backend/routes/repositories.ts before the closing }

  // Get Issue Details
  fastify.get(
    "/repositories/:id/issues/:number",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
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

        if (!issue) throw NotFound("Issue not found");
        return issue;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch issue");
      }
    },
  );

  // Update Issue
  fastify.patch(
    "/repositories/:id/issues/:number",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };
      const user = request.user!;
      const { title, body, milestoneId } = request.body as {
        title?: string;
        body?: string;
        milestoneId?: string | null;
      };

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const updated = await IssueService.updateIssue(issue.id, {
          title,
          body,
          milestoneId,
        });

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "ISSUE_UPDATE",
          resource: `repo:${repoId}/issue:${number}`,
          details: { title, body, milestoneId },
          ipAddress: request.ip,
        });

        return updated;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update issue");
      }
    },
  );

  // Close Issue
  fastify.post(
    "/repositories/:id/issues/:number/close",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };
      const user = request.user!;
      const { stateReason } = request.body as {
        stateReason?: "completed" | "not_planned";
      };

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const closed = await IssueService.closeIssue(
          issue.id,
          user.userId,
          stateReason || "completed",
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "ISSUE_CLOSE",
          resource: `repo:${repoId}/issue:${number}`,
          details: { stateReason },
          ipAddress: request.ip,
        });

        return closed;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to close issue");
      }
    },
  );

  // Reopen Issue
  fastify.post(
    "/repositories/:id/issues/:number/reopen",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };
      const user = request.user!;

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const reopened = await IssueService.reopenIssue(issue.id);

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "ISSUE_REOPEN",
          resource: `repo:${repoId}/issue:${number}`,
          details: {},
          ipAddress: request.ip,
        });

        return reopened;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to reopen issue");
      }
    },
  );

  // Add Assignee
  fastify.post(
    "/repositories/:id/issues/:number/assignees",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };
      const { userId } = request.body as { userId: string };

      if (!userId) throw BadRequest("userId is required");

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const assignee = await IssueService.addAssignee(issue.id, userId);

        return assignee;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to add assignee");
      }
    },
  );

  // Remove Assignee
  fastify.delete(
    "/repositories/:id/issues/:number/assignees/:userId",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const {
        id: repoId,
        number,
        userId,
      } = request.params as {
        id: string;
        number: string;
        userId: string;
      };

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        await IssueService.removeAssignee(issue.id, userId);

        return { success: true };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to remove assignee");
      }
    },
  );

  // Add Label
  fastify.post(
    "/repositories/:id/issues/:number/labels",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };
      const { labelId } = request.body as { labelId: string };

      if (!labelId) throw BadRequest("labelId is required");

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const updated = await IssueService.addLabel(issue.id, labelId);

        return updated;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to add label");
      }
    },
  );

  // Remove Label
  fastify.delete(
    "/repositories/:id/issues/:number/labels/:labelId",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const {
        id: repoId,
        number,
        labelId,
      } = request.params as {
        id: string;
        number: string;
        labelId: string;
      };

      try {
        const issue = await prisma.issue.findUnique({
          where: {
            repoId_number: {
              repoId,
              number: parseInt(number),
            },
          },
        });

        if (!issue) throw NotFound("Issue not found");

        const { IssueService } = await import("../services/issueService");
        const updated = await IssueService.removeLabel(issue.id, labelId);

        return updated;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to remove label");
      }
    },
  );

  // ========== MILESTONE ENDPOINTS ==========

  // List Milestones
  fastify.get(
    "/repositories/:id/milestones",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.query as { status?: string };

      try {
        const { IssueService } = await import("../services/issueService");
        const milestones = await IssueService.listMilestones(id, status);
        return milestones;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch milestones");
      }
    },
  );

  // Create Milestone
  fastify.post(
    "/repositories/:id/milestones",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const user = request.user!;
      const { title, description, dueDate } = request.body as {
        title: string;
        description?: string;
        dueDate?: string;
      };

      if (!title) throw BadRequest("title is required");

      try {
        const { IssueService } = await import("../services/issueService");
        const milestone = await IssueService.createMilestone(
          repoId,
          title,
          description,
          dueDate ? new Date(dueDate) : undefined,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "MILESTONE_CREATE",
          resource: `repo:${repoId}/milestone:${milestone.id}`,
          details: { title },
          ipAddress: request.ip,
        });

        return milestone;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to create milestone");
      }
    },
  );

  // Update Milestone
  fastify.patch(
    "/repositories/:id/milestones/:milestoneId",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { milestoneId } = request.params as { milestoneId: string };
      const { title, description, dueDate } = request.body as {
        title?: string;
        description?: string;
        dueDate?: string | null;
      };

      try {
        const { IssueService } = await import("../services/issueService");
        const milestone = await IssueService.updateMilestone(milestoneId, {
          title,
          description,
          dueDate:
            dueDate === null ? null : dueDate ? new Date(dueDate) : undefined,
        });

        return milestone;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update milestone");
      }
    },
  );

  // Close Milestone
  fastify.post(
    "/repositories/:id/milestones/:milestoneId/close",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { milestoneId } = request.params as { milestoneId: string };

      try {
        const { IssueService } = await import("../services/issueService");
        const milestone = await IssueService.closeMilestone(milestoneId);

        return milestone;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to close milestone");
      }
    },
  );

  // Project Board API Endpoints
  // Add to backend/routes/repositories.ts

  // ========== PROJECT BOARD ENDPOINTS ==========

  // List Boards
  fastify.get(
    "/repositories/:id/boards",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const boards = await ProjectBoardService.listBoards(id);
        return boards;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch boards");
      }
    },
  );

  // Create Board
  fastify.post(
    "/repositories/:id/boards",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const user = request.user!;
      const { name, description, layout } = request.body as {
        name: string;
        description?: string;
        layout?: "KANBAN" | "TABLE";
      };

      if (!name) throw BadRequest("name is required");

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const board = await ProjectBoardService.createBoard(
          repoId,
          name,
          description,
          layout,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "BOARD_CREATE",
          resource: `repo:${repoId}/board:${board.id}`,
          details: { name },
          ipAddress: request.ip,
        });

        return board;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to create board");
      }
    },
  );

  // Get Board Details
  fastify.get(
    "/boards/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const board = await ProjectBoardService.getBoard(id);
        if (!board) throw NotFound("Board not found");
        return board;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch board");
      }
    },
  );

  // Update Board
  fastify.patch(
    "/boards/:id",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { name, description, layout } = request.body as {
        name?: string;
        description?: string;
        layout?: "KANBAN" | "TABLE";
      };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const board = await ProjectBoardService.updateBoard(id, {
          name,
          description,
          layout,
        });
        return board;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update board");
      }
    },
  );

  // Delete Board
  fastify.delete(
    "/boards/:id",
    { preHandler: requireRepoCapability("administer_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        await ProjectBoardService.deleteBoard(id);
        return { success: true };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to delete board");
      }
    },
  );

  // Add Column
  fastify.post(
    "/boards/:id/columns",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: boardId } = request.params as { id: string };
      const { name, position } = request.body as {
        name: string;
        position?: number;
      };

      if (!name) throw BadRequest("name is required");

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const column = await ProjectBoardService.addColumn(
          boardId,
          name,
          position,
        );
        return column;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to add column");
      }
    },
  );

  // Update Column
  fastify.patch(
    "/columns/:id",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { name } = request.body as { name?: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const column = await ProjectBoardService.updateColumn(id, { name });
        return column;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update column");
      }
    },
  );

  // Delete Column
  fastify.delete(
    "/columns/:id",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        await ProjectBoardService.deleteColumn(id);
        return { success: true };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to delete column");
      }
    },
  );

  // Add Card
  fastify.post(
    "/columns/:id/cards",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: columnId } = request.params as { id: string };
      const { issueId, prId, noteTitle, noteBody, position } = request.body as {
        issueId?: string;
        prId?: string;
        noteTitle?: string;
        noteBody?: string;
        position?: number;
      };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const card = await ProjectBoardService.addCard(
          columnId,
          { issueId, prId, noteTitle, noteBody },
          position,
        );
        return card;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to add card");
      }
    },
  );

  // Move Card
  fastify.patch(
    "/cards/:id/move",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: cardId } = request.params as { id: string };
      const { columnId, position } = request.body as {
        columnId: string;
        position: number;
      };

      if (!columnId || position === undefined) {
        throw BadRequest("columnId and position are required");
      }

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const card = await ProjectBoardService.moveCard(
          cardId,
          columnId,
          position,
        );
        return card;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to move card");
      }
    },
  );

  // Update Card
  fastify.patch(
    "/cards/:id",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: cardId } = request.params as { id: string };
      const { noteTitle, noteBody } = request.body as {
        noteTitle?: string;
        noteBody?: string;
      };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        const card = await ProjectBoardService.updateCard(cardId, {
          noteTitle,
          noteBody,
        });
        return card;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update card");
      }
    },
  );

  // Delete Card
  fastify.delete(
    "/cards/:id",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: cardId } = request.params as { id: string };

      try {
        const { ProjectBoardService } =
          await import("../services/projectBoardService");
        await ProjectBoardService.deleteCard(cardId);
        return { success: true };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to delete card");
      }
    },
  );

  // Discussion API Endpoints

  // ========== DISCUSSION ENDPOINTS ==========

  // List Discussions
  fastify.get(
    "/repositories/:id/discussions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { category, authorId } = request.query as {
        category?: string;
        authorId?: string;
      };

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const discussions = await DiscussionService.listDiscussions(id, {
          category,
          authorId,
        });
        return discussions;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch discussions");
      }
    },
  );

  // Create Discussion
  fastify.post(
    "/repositories/:id/discussions",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const user = request.user!;
      const { title, body, category } = request.body as {
        title: string;
        body: string;
        category?: any;
      };

      if (!title || !body) throw BadRequest("title and body are required");

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const discussion = await DiscussionService.createDiscussion(
          repoId,
          user.userId,
          title,
          body,
          category,
        );

        // Audit Log
        await AuditService.log({
          enterpriseId: undefined,
          actorId: user.userId,
          action: "DISCUSSION_CREATE",
          resource: `repo:${repoId}/discussion:${discussion.id}`,
          details: { title },
          ipAddress: request.ip,
        });

        return discussion;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to create discussion");
      }
    },
  );

  // Get Discussion Detail
  fastify.get(
    "/repositories/:id/discussions/:number",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id: repoId, number } = request.params as {
        id: string;
        number: string;
      };

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const discussion = await DiscussionService.getDiscussion(
          repoId,
          parseInt(number),
        );
        if (!discussion) throw NotFound("Discussion not found");
        return discussion;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch discussion");
      }
    },
  );

  // Add Comment/Reply
  fastify.post(
    "/discussions/:id/comments",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: discussionId } = request.params as { id: string };
      const user = request.user!;
      const { body, parentId } = request.body as {
        body: string;
        parentId?: string;
      };

      if (!body) throw BadRequest("body is required");

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const comment = await DiscussionService.addComment(
          discussionId,
          user.userId,
          body,
          parentId,
        );
        return comment;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to add comment");
      }
    },
  );

  // Mark Answer
  fastify.post(
    "/discussions/:id/mark-answer/:commentId",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id: discussionId, commentId } = request.params as {
        id: string;
        commentId: string;
      };

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const discussion = await DiscussionService.markAnswer(
          discussionId,
          commentId,
        );
        return discussion;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to mark answer");
      }
    },
  );

  // Discussion Reaction
  fastify.post(
    "/discussions/:id/reactions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id: discussionId } = request.params as { id: string };
      const user = request.user!;
      const { emoji } = request.body as { emoji: string };

      if (!emoji) throw BadRequest("emoji is required");

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const result = await DiscussionService.toggleReaction(
          user.userId,
          emoji,
          {
            discussionId,
          },
        );
        return result;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to toggle reaction");
      }
    },
  );

  // Comment Reaction
  fastify.post(
    "/discussion-comments/:id/reactions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id: commentId } = request.params as { id: string };
      const user = request.user!;
      const { emoji } = request.body as { emoji: string };

      if (!emoji) throw BadRequest("emoji is required");

      try {
        const { DiscussionService } =
          await import("../services/discussionService");
        const result = await DiscussionService.toggleReaction(
          user.userId,
          emoji,
          {
            commentId,
          },
        );
        return result;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to toggle reaction");
      }
    },
  );

  // Security API Endpoints

  // ========== SECURITY ENDPOINTS ==========

  // List Security Alerts
  fastify.get(
    "/repositories/:id/security/alerts",
    { preHandler: requireRepoCapability("read_repo") },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        const { SecurityService } = await import("../services/securityService");
        const alerts = await SecurityService.getAlerts(id);
        return alerts;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to fetch security alerts");
      }
    },
  );

  // Trigger Full Security Scan
  fastify.post(
    "/repositories/:id/security/scan",
    { preHandler: requireRepoCapability("write_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const user = request.user!;

      try {
        const { SecurityService } = await import("../services/securityService");

        // Audit Log
        await AuditService.log({
          actorId: user.userId,
          action: "SECURITY_SCAN_TRIGGER",
          resource: `repo:${repoId}`,
          ipAddress: request.ip,
        });

        const alerts = await SecurityService.performFullScan(repoId);
        // Also try real SCA if environment allows
        try {
          await SecurityService.auditRepoDependencies(repoId);
        } catch (scaErr) {
          request.log.warn(
            "Real SCA scan failed, falling back to mocks",
            scaErr,
          );
        }

        return { message: "Scan completed", alertCount: alerts.length };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to perform security scan");
      }
    },
  );

  // Update Alert Status
  fastify.patch(
    "/security/alerts/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as {
        status: "FIXED" | "DISMISSED" | "OPEN";
      };

      if (!["FIXED", "DISMISSED", "OPEN"].includes(status)) {
        throw BadRequest("Invalid status");
      }

      try {
        const { SecurityService } = await import("../services/securityService");
        const alert = await SecurityService.updateAlertStatus(
          id,
          status as any,
        );
        return alert;
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to update alert status");
      }
    },
  );

  // Upload SARIF (Advanced SAST)
  fastify.post(
    "/repositories/:id/security/sarif",
    { preHandler: requireRepoCapability("write_repo") },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const sarif = request.body;

      try {
        const { SecurityService } = await import("../services/securityService");
        const alerts = await SecurityService.uploadSarif(repoId, sarif);
        return { message: "SARIF ingested", alertCount: alerts.length };
      } catch (e: any) {
        request.log.error(e);
        throw InternalError("Failed to ingest SARIF data");
      }
    },
  );

  // Get File Content (Raven Support)
  fastify.get(
    "/repositories/:id/content",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request) => {
      const { id } = request.params as { id: string };
      const { path: filePath } = request.query as { path: string };

      if (!filePath) throw BadRequest("file path is required");

      const mirrorPath = path.join(
        process.cwd(),
        "storage",
        "mirrors",
        id,
        filePath,
      );

      try {
        const content = fs.readFileSync(mirrorPath, "utf-8");
        return { content };
      } catch (err) {
        throw NotFound("File not found in mirror");
      }
    },
  );
}
