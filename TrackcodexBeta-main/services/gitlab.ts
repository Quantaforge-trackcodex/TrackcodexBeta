export interface GitLabRepo {
  id: number;
  name: string;
  path_with_namespace: string;
  visibility: string;
  web_url: string;
  description: string | null;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  namespace: {
    avatar_url: string;
  };
}

export const gitlabService = {
  async verifyToken(token: string): Promise<unknown> {
    const res = await fetch("https://gitlab.com/api/v4/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Invalid GitLab Token");
    return res.json();
  },

  async getRepos(token: string): Promise<GitLabRepo[]> {
    // Fetch projects where user is a member
    const res = await fetch(
      "https://gitlab.com/api/v4/projects?membership=true&simple=true&per_page=20&order_by=updated_at",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw new Error("Failed to fetch GitLab repositories");
    return res.json();
  },
};
