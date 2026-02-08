export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  default_branch?: string;
  open_issues_count: number;
  license: { key: string; name: string } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const githubService = {
  async verifyToken(token: string): Promise<any> {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) throw new Error("Invalid Token");
    return res.json();
  },

  async getRepos(token: string): Promise<GitHubRepo[]> {
    const res = await fetch(
      "https://api.github.com/user/repos?sort=updated&per_page=20",
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch repositories");
    return res.json();
  },

  async createFile(
    token: string,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
  ): Promise<any> {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: btoa(content), // Base64 encode content
        }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create file");
    }
    return res.json();
  },

  calculateSkillDNA(repos: GitHubRepo[]): { name: string; level: number }[] {
    const skillsMap: Record<string, { count: number; stars: number }> = {};

    repos.forEach((repo) => {
      if (!repo.language) return;
      if (!skillsMap[repo.language]) {
        skillsMap[repo.language] = { count: 0, stars: 0 };
      }
      skillsMap[repo.language].count++;
      skillsMap[repo.language].stars += repo.stargazers_count;
    });

    const scores = Object.entries(skillsMap).map(([lang, stats]) => {
      // Formula: Base 10 per repo + 2 per star
      const rawScore = stats.count * 10 + stats.stars * 2;
      return { name: lang, rawScore };
    });

    if (scores.length === 0) return [];

    // Normalize: Top skill gets 95%, others relative
    const maxScore = Math.max(...scores.map((s) => s.rawScore));

    return scores
      .map((s) => ({
        name: s.name,
        level: Math.round((s.rawScore / maxScore) * 95),
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 5); // Top 5 skills
  },

  async getAssignedIssues(token: string): Promise<any[]> {
    const res = await fetch(
      "https://api.github.com/issues?filter=assigned&state=open&sort=updated&per_page=10",
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch issues");
    return res.json();
  },

  async getRepoById(token: string, id: string): Promise<GitHubRepo> {
    const res = await fetch(`https://api.github.com/repositories/${id}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch repository details");
    return res.json();
  },

  async getRepoContents(
    token: string,
    owner: string,
    repo: string,
    path: string = "",
  ): Promise<any[]> {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch contents");
    return res.json();
  },

  async getRepoIssues(
    token: string,
    owner: string,
    repo: string,
  ): Promise<any[]> {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=open&sort=updated`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch repo issues");
    return res.json();
  },

  async getRepoPRs(token: string, owner: string, repo: string): Promise<any[]> {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&sort=updated`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch pull requests");
    return res.json();
  },
};
