import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface SocialUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  company?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  author: { name: string; avatar: string };
  text: string;
  createdAt: string;
}

export type PostType =
  | "discussion"
  | "repo_update"
  | "job_alert"
  | "showcase"
  | "question";

export interface Post {
  id: string;
  title?: string;
  content: string;
  type: PostType;
  author: { id: string; name: string; avatar: string; role?: string };
  createdAt: string;
  comments: Comment[];
  likes: number;

  // Rich Media / Context (Optional for real hardware data)
  mediaUrl?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  repoLink?: {
    name: string;
    description: string;
    stars: number;
    language: string;
  };
  jobDetails?: {
    company: string;
    role: string;
    salary: string;
    location: string;
  };
  shares?: number;
  isLiked?: boolean;
  community?: {
    id: string;
    name: string;
    slug: string;
    avatar?: string;
  };
  workspace?: {
    id: string;
    name: string;
    description?: string;
  };
  researchPaperUrl?: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  isSearchable: boolean;
  creatorId: string;
  createdAt: string;
  _count?: {
    members: number;
    posts: number;
  };
}

const MOCK_POSTS: Post[] = [
  {
    id: "mock-1",
    title: "Introducing TrackCodex: The Future of Developer Workspaces",
    content: "We're excited to reveal what we've been working on! TrackCodex is a gamified, all-in-one developer productivity platform. Check out our new workspace features!",
    type: "showcase",
    author: {
      id: "u1",
      name: "TrackCodex Team",
      avatar: "https://github.com/Quantaforge-trackcodex.png",
      role: "Core Team",
    },
    createdAt: new Date().toISOString(),
    comments: [],
    likes: 128,
    mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mock-2",
    content: "Does anyone have experience with the new React 19 compiler? I'm trying to optimize a large dashboard and wondering if it's worth the migration effort right now.",
    type: "question",
    author: {
      id: "u2",
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      role: "Frontend Lead",
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [],
    likes: 42,
    codeSnippet: {
      language: "tsx",
      code: "const Dashboard = () => {\n  // Looking to optimize this rendering\n  return <ComplexChart data={largeDataset} />;\n}",
    },
  },
  {
    id: "mock-3",
    type: "repo_update",
    content: "New release v2.0 is out! Major performance improvements and a new plugin system.",
    author: {
      id: "u3",
      name: "Rust Foundation",
      avatar: "https://avatars.githubusercontent.com/u/5430905?s=200&v=4",
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    comments: [],
    likes: 89,
    repoLink: {
      name: "rust-lang/rust",
      description: "Empowering everyone to build reliable and efficient software.",
      stars: 94120,
      language: "Rust",
    },
  },
];

export const socialService = {
  getFeed: async (): Promise<Post[]> => {
    try {
      // Return mocks for now, or merge with real data if available
      // const response = await axios.get(`${API_BASE_URL}/community/posts`, {
      //   withCredentials: true,
      // });
      // return [...MOCK_POSTS, ...response.data...];

      // For now, just return mock posts to guarantee they appear
      return MOCK_POSTS;
    } catch (err) {
      console.error("❌ Failed to fetch community feed:", err);
      // Fallback to mocks
      return MOCK_POSTS;
    }
  },

  likePost: async (postId: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}/community/posts/${postId}/like`,
        {},
        { withCredentials: true },
      );
      return true;
    } catch (err) {
      return false;
    }
  },

  createPost: async (content: string, title?: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/community/posts`,
        {
          content,
          title,
          // Backend handles authorId from session in a real app,
          // but our current mock backend might need it explicitly if session isn't linked.
          // Let's assume the backend handles it.
        },
        { withCredentials: true },
      );
      return response.data;
    } catch (err) {
      console.error("❌ Failed to create post:", err);
      throw err;
    }
  },

  // Community Management
  createCommunity: async (data: {
    name: string;
    description?: string;
    avatar?: string;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/community`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("❌ Failed to create community:", err);
      throw err;
    }
  },

  getCommunity: async (slug: string): Promise<Community | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community/${slug}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("❌ Failed to fetch community:", err);
      return null;
    }
  },

  joinCommunity: async (slug: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}/community/${slug}/join`,
        {},
        { withCredentials: true },
      );
      return true;
    } catch (err) {
      console.error("❌ Failed to join community:", err);
      return false;
    }
  },

  getCommunityFeed: async (communityId: string): Promise<Post[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community/posts`, {
        params: { communityId },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error("❌ Failed to fetch community feed:", err);
      return [];
    }
  },
};
