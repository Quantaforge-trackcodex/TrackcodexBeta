import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  role: string;
  bio: string;
  company: string;
  location: string;
  website: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  createdAt: string;

  // Profile README & Resume
  profileReadme?: string | null;
  resumeUrl?: string | null;
  resumeFilename?: string | null;
  resumeUploadedAt?: string | null;
  showResume?: boolean;
  showReadme?: boolean;

  // Portfolio visibility settings
  showPortfolio?: boolean;
  showRepositories?: boolean;
  showContributions?: boolean;
  pinnedItems?: string[];
}

export const profileService = {
  /**
   * Get a user's profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },

  /**
   * Follow a user
   */
  async followUser(userId: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/users/${userId}/follow`,
        {},
        { withCredentials: true },
      );
    } catch (error: any) {
      console.error("Error following user:", error);
      throw new Error(error.response?.data?.message || "Failed to follow user");
    }
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}/follow`, {
        withCredentials: true,
      });
    } catch (error: any) {
      console.error("Error unfollowing user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },

  /**
   * Get a user's followers
   */
  async getFollowers(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/followers`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching followers:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch followers",
      );
    }
  },

  /**
   * Get users that this user follows
   */
  async getFollowing(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/following`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching following:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch following",
      );
    }
  },
};
