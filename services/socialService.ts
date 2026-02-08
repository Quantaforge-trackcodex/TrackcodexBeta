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

export const socialService = {
  getFeed: async (): Promise<Post[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/community/posts`, {
        withCredentials: true,
      });
      return response.data.map((p: any) => ({
        ...p,
        likes: (p as any).likes || 0,
        author: p.author || {
          name: "Unknown",
          avatar: "https://ui-avatars.com/api/?name=U",
        },
      }));
    } catch (err) {
      console.error("❌ Failed to fetch community feed:", err);
      return [];
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
