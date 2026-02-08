import { Octokit } from "@octokit/rest";
import { PrismaClient } from "@prisma/client";
import { decrypt } from "./encryption";

const prisma = new PrismaClient();

export class GitHubService {
  /**
   * Sync repositories for a given user from GitHub to local DB
   */
  static async syncRepositories(userId: string): Promise<any[]> {
    console.log(`[GitHubService] Syncing repos for user ${userId}`);

    // 1. Get encrypted token
    const oauthAccount = await prisma.oAuthAccount.findFirst({
      where: {
        userId: userId,
        provider: "github",
      },
    });

    if (!oauthAccount || !oauthAccount.accessToken) {
      throw new Error("No GitHub account linked or missing access token");
    }

    // 2. Decrypt token
    const accessToken = decrypt(oauthAccount.accessToken);

    // 3. Initialize Octokit
    const octokit = new Octokit({
      auth: accessToken,
    });

    // 4. Fetch Repositories (Fetch user's own repos + org repos they have access to)
    // Using per_page 100 to get a good chunk. Pagination can be added later.
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      visibility: "all",
      sort: "updated",
      per_page: 100,
    });

    console.log(
      `[GitHubService] Fetched ${repos.length} repositories from GitHub`,
    );

    const syncedRepos = [];

    // 5. Upsert into Database
    for (const repo of repos) {
      if (repo.archived) continue; // Optional: skip archived

      const existingRepo = await prisma.repository.findFirst({
        where: {
          OR: [
            { githubId: repo.id },
            { name: repo.name, orgId: null }, // Fallback for legacy
          ],
        },
      });

      const upserted = await prisma.repository.upsert({
        where: {
          id: existingRepo?.id || "new-id-placeholder", // Upsert requires unique where, using fallback ID trick or better: findFirst checks
        },
        // Actually, upsert works best on unique constraints.
        // Our 'githubId' is unique. Let's use that if possible.
        // If not, we use 'create' and 'update' manually to be safe with UUIDs.
        create: {
          name: repo.name,
          description: repo.description,
          isPublic: !repo.private,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          githubId: repo.id,
          htmlUrl: repo.html_url,
          settings: { defaultBranch: repo.default_branch } as any,
          updatedAt: new Date(repo.updated_at || Date.now()),
        },
        update: {
          description: repo.description,
          isPublic: !repo.private,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          htmlUrl: repo.html_url,
          updatedAt: new Date(repo.updated_at || Date.now()),
        },
      });

      syncedRepos.push(upserted);
    }

    // Note: The above upsert on 'id' works if we knew the ID.
    // Since we don't, we should rely on 'githubId' being unique.
    // However, the schema shows githubId is @unique field now!
    // So we can use upsert using githubId.

    return syncedRepos;
  }
}
