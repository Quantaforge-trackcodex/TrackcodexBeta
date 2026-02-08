import { FastifyInstance } from "fastify";
import { GitServer } from "../services/git/gitServer";
import { requireRepoPermission, RepoLevel } from "../middleware/repoAuth";
import { prisma } from "../lib/prisma"; // Ensure this import exists

export async function insightsRoutes(fastify: FastifyInstance) {
  // GET /repositories/:id/insights/pulse
  fastify.get(
    "/repositories/:id/insights/pulse",
    { preHandler: requireRepoPermission(RepoLevel.READ) },
    async (request, reply) => {
      const { id: repoId } = request.params as { id: string };
      const { period = "week" } = request.query as { period?: string };

      try {
        const gitServer = new GitServer();
        const repoPath = gitServer.getRepoPath(repoId);

        // Get commits based on period
        let since = "7 days ago";
        let sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 7);

        if (period === "day") {
          since = "24 hours ago";
          sinceDate = new Date();
          sinceDate.setHours(sinceDate.getHours() - 24);
        }
        if (period === "month") {
          since = "1 month ago";
          sinceDate = new Date();
          sinceDate.setMonth(sinceDate.getMonth() - 1);
        }

        // Fetch commits
        // git log --since="7 days ago" --pretty=format:"%h|%an|%s"
        const logOutput = await gitServer.spawnGit(
          ["log", `--since=${since}`, "--pretty=format:%h|%an|%s"],
          repoPath,
        );

        const commits = logOutput
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const [sha, author, message] = line.split("|");
            return { sha, author, message };
          });

        // Fetch Real PR and Issue Stats from DB
        const [mergedPRs, openPRs, closedIssues, newIssues] = await Promise.all(
          [
            prisma.pullRequest.count({
              where: {
                repoId,
                status: "MERGED",
                updatedAt: { gte: sinceDate },
              },
            }),
            prisma.pullRequest.count({
              where: { repoId, status: "OPEN" },
            }),
            prisma.issue.count({
              where: {
                repoId,
                status: "CLOSED",
                updatedAt: { gte: sinceDate },
              },
            }),
            prisma.issue.count({
              where: {
                repoId,
                createdAt: { gte: sinceDate },
              },
            }),
          ],
        );

        return {
          activePullRequests: {
            merged: mergedPRs,
            open: openPRs,
          },
          activeIssues: {
            closed: closedIssues,
            new: newIssues,
          },
          commits: {
            total: commits.length,
            authors: [...new Set(commits.map((c) => c.author))].length,
          },
        };
      } catch (e: any) {
        request.log.error(e);
        return reply.code(500).send({ error: "Failed to fetch pulse data" });
      }
    },
  );
}
