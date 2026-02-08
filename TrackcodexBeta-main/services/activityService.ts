import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface Activity {
  id: string;
  userId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ActivityStats {
  [action: string]: number;
}

// Activity types enum for consistent action naming
export enum ActivityType {
  FOLLOW_USER = "followed_user",
  STAR_WORKSPACE = "starred_repo",
  CREATE_WORKSPACE = "created_repo",
  FORK_WORKSPACE = "forked_repo",
  CREATE_ISSUE = "created_issue",
  CREATE_PR = "created_pr",
  MERGE_PR = "merged_pr",
  COMMENT = "commented",
}

export const activityService = {
  /**
   * Get a user's activity timeline
   */
  async getUserActivity(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ activities: Activity[]; total: number }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/activity`,
        {
          params: { page, limit },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching activity:", error);
      // Return empty data instead of throwing
      return { activities: [], total: 0 };
    }
  },

  /**
   * Get activity feed from users you follow
   */
  async getFollowingFeed(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ activities: Activity[]; total: number }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/activity/following`,
        {
          params: { page, limit },
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching following feed:", error);
      // Return empty data instead of throwing to prevent UI crashes
      return { activities: [], total: 0 };
    }
  },

  /**
   * Get activity statistics for a user
   */
  async getActivityStats(userId: string): Promise<ActivityStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/activity/stats`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching activity stats:", error);
      return {};
    }
  },

  /**
   * Format activity for display
   */
  formatActivity(activity: Activity): {
    title: string;
    description?: string;
    icon: string;
  } {
    const actionMap: Record<string, { title: string; icon: string }> = {
      created_repo: { title: "Created repository", icon: "📦" },
      starred_repo: { title: "Starred repository", icon: "⭐" },
      forked_repo: { title: "Forked repository", icon: "🔱" },
      created_issue: { title: "Created issue", icon: "🐛" },
      created_pr: { title: "Created pull request", icon: "🔀" },
      merged_pr: { title: "Merged pull request", icon: "✅" },
      commented: { title: "Commented on", icon: "💬" },
      followed_user: { title: "Followed", icon: "👤" },
    };

    const formatted = actionMap[activity.action] || {
      title: activity.action,
      icon: "📌",
    };

    return {
      ...formatted,
      description: activity.metadata?.description || activity.metadata?.name,
    };
  },

  /**
   * Get relative time string
   */
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return date.toLocaleDateString();
  },
};
