import { UserProfile } from "./profile";

export type AccessRole = "owner" | "admin" | "write" | "read";

export interface Collaborator {
  user: {
    id: string; // username
    name: string;
    avatar: string;
    email?: string;
  };
  role: AccessRole;
  joinedAt: string;
}

export interface FullRepoSettings {
  name?: string;
  isTemplate?: boolean;
  requireCommitSignOff?: boolean;
  defaultBranch?: string;
  releaseImmutability?: boolean;
  socialPreview?: string;
  features?: {
    wikis?: boolean;
    restrictWiki?: boolean;
    issues?: boolean;
    sponsorships?: boolean;
    preserve?: boolean;
    discussions?: boolean;
    projects?: boolean;
  };
  pullRequests?: {
    allowMerge?: boolean;
    mergeMessage?: string;
    allowSquash?: boolean;
    squashMessage?: string;
    allowRebase?: boolean;
    alwaysSuggestUpdate?: boolean;
    autoMerge?: boolean;
    deleteHead?: boolean;
  };
  archives?: {
    includeLfs?: boolean;
  };
  pushes?: {
    limitEnabled?: boolean;
    limit?: number;
  };
  issues?: {
    autoClose?: boolean;
  };
}

// Mock Data
const MOCK_COLLABORATORS: Record<string, Collaborator[]> = {
  "my-repo-1": [
    {
      user: {
        id: "current-user",
        name: "Me",
        avatar: "https://i.pravatar.cc/150?u=me",
      },
      role: "owner",
      joinedAt: "2025-01-01",
    },
    {
      user: {
        id: "sarah_dev",
        name: "Sarah Developer",
        avatar: "https://i.pravatar.cc/150?u=sarah",
      },
      role: "admin",
      joinedAt: "2025-02-15",
    },
    {
      user: {
        id: "mike_security",
        name: "Mike Sec",
        avatar: "https://i.pravatar.cc/150?u=mike",
      },
      role: "write",
      joinedAt: "2025-03-01",
    },
  ],
};

const MOCK_SETTINGS: Record<string, FullRepoSettings> = {
  "my-repo-1": {
    name: "meeting_1",
    isTemplate: false,
    requireCommitSignOff: true,
    defaultBranch: "main",
    releaseImmutability: true,
    features: {
      wikis: true,
      issues: true,
      discussions: true,
      projects: true,
    },
    pullRequests: {
      allowMerge: true,
      allowSquash: true,
      allowRebase: true,
      deleteHead: true,
    },
  },
};

class RepoService {
  private apiUrl = "http://localhost:4000/api/v1";

  async getCollaborators(repoId: string): Promise<Collaborator[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_COLLABORATORS[repoId] || MOCK_COLLABORATORS["my-repo-1"]; // Fallback for demo
  }

  async getSettings(repoId: string): Promise<FullRepoSettings> {
    try {
      const resp = await fetch(`${this.apiUrl}/repositories/${repoId}`);
      if (!resp.ok) return {};
      const data = await resp.json();
      return (data.settings as FullRepoSettings) || {};
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async updateSettings(
    repoId: string,
    settings: FullRepoSettings,
  ): Promise<void> {
    const resp = await fetch(`${this.apiUrl}/repositories/${repoId}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    if (!resp.ok) throw new Error("Failed to update settings");
  }

  async updateRole(
    repoId: string,
    userId: string,
    newRole: AccessRole,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const collaborators =
      MOCK_COLLABORATORS[repoId] || MOCK_COLLABORATORS["my-repo-1"];
    const member = collaborators.find((c) => c.user.id === userId);
    if (member) {
      member.role = newRole;
    }
  }

  async inviteCollaborator(
    repoId: string,
    email: string,
    role: AccessRole,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Mock adding them
    const collaborators =
      MOCK_COLLABORATORS[repoId] || MOCK_COLLABORATORS["my-repo-1"];
    collaborators.push({
      user: {
        id: email.split("@")[0],
        name: email.split("@")[0],
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      },
      role,
      joinedAt: "Just now",
    });
  }

  // Permission Check Helper
  canMerge(userRole: AccessRole): boolean {
    return ["owner", "admin", "write"].includes(userRole);
  }

  canManageSettings(userRole: AccessRole): boolean {
    return ["owner", "admin"].includes(userRole);
  }
}

export const repoService = new RepoService();
