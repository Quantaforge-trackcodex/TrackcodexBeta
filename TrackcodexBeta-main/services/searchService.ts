// Search Service

export interface SearchResult {
  id: string;
  type: "user" | "repo" | "workspace" | "job" | "org" | "nav";
  label: string;
  subLabel?: string; // Role, Tech Stack, Description
  icon: string;
  url: string; // Navigation path
  group: string;
  metadata?: Record<string, any>; // Extra data for rendering (e.g., avatar URL, skills)
}

// MOCK DATA GENERATORS

const MOCK_USERS = [
  {
    id: "u1",
    name: "Alex Rivera",
    username: "@arivera",
    role: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Three.js"],
    avatar: "https://i.pravatar.cc/150?u=u1",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    username: "@schen_ai",
    role: "AI Research Scientist",
    skills: ["Python", "PyTorch", "LLMs"],
    avatar: "https://i.pravatar.cc/150?u=u2",
  },
  {
    id: "u3",
    name: "David Kim",
    username: "@dkim",
    role: "Full Stack Developer",
    skills: ["Node.js", "PostgreSQL", "React"],
    avatar: "https://i.pravatar.cc/150?u=u3",
  },
  {
    id: "u4",
    name: "Emily Davis",
    username: "@edavis",
    role: "Product Designer",
    skills: ["Figma", "UI/UX", "Tailwind"],
    avatar: "https://i.pravatar.cc/150?u=u4",
  },
  {
    id: "u5",
    name: "Michael Scott",
    username: "@mscott",
    role: "Regional Manager",
    skills: ["Management", "Sales"],
    avatar: "https://i.pravatar.cc/150?u=u5",
  },
];

// MOCK_JOBS removed

// ... (previous MOCK_USERS and MOCK_REPOS stay local for now, or could be moved)

const MOCK_REPOS = [
  {
    id: "r1",
    name: "trackcodex-core",
    owner: "Quantaforze",
    stars: 1240,
    lang: "TypeScript",
  },
  {
    id: "r2",
    name: "hyper-terminal",
    owner: "vercel",
    stars: 45000,
    lang: "JavaScript",
  },
  {
    id: "r3",
    name: "linux",
    owner: "torvalds",
    stars: 150000,
    lang: "C",
  },
];

class SearchService {
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
      // 1. General Search (Users, Repos, Jobs)
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results: SearchResult[] = data.results || [];

      // 2. Raven Code Search (Symbols)
      const codeRes = await fetch(
        `/api/v1/search/code?q=${encodeURIComponent(query)}`,
      );
      const codeData = await codeRes.json();
      const codeResults: SearchResult[] = codeData.results || [];

      // Blend results
      return [...results, ...codeResults];
    } catch (error) {
      console.error("Search API failed, falling back to mock", error);
      return this.mockSearch(query);
    }
  }

  private mockSearch(query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Fallback mock logic (preserving existing behavior for offline/dev)
    const matchedUsers = MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.username.toLowerCase().includes(lowerQuery),
    );
    matchedUsers.forEach((u) =>
      results.push({
        id: u.id,
        type: "user",
        label: u.name,
        subLabel: u.role,
        icon: "person",
        url: `/profile/${u.username}`,
        group: "People",
      }),
    );

    const matchedRepos = MOCK_REPOS.filter((r) =>
      r.name.toLowerCase().includes(lowerQuery),
    );
    matchedRepos.forEach((r) =>
      results.push({
        id: r.id,
        type: "repo",
        label: `${r.owner}/${r.name}`,
        subLabel: r.lang,
        icon: "folder_open",
        url: `/repo/${r.id}`,
        group: "Repositories",
      }),
    );

    return results;
  }
}

export const searchService = new SearchService();
