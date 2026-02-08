import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 for color intensity
}

export const contributionStatsService = {
  /**
   * Get contribution graph data for a given year
   * Uses Activity model to track contributions
   */
  async getContributionGraph(
    userId: string,
    year: number = new Date().getFullYear(),
  ): Promise<ContributionDay[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Get all activities for the year (using Activity model)
    const activities = await prisma.activity.groupBy({
      by: ["createdAt"],
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        type: {
          in: ["commit", "push", "pull_request", "merge"],
        },
      },
      _count: {
        id: true,
      },
    });

    // Create a map of date -> count
    const activityMap = new Map<string, number>();
    activities.forEach((activity: any) => {
      const date = activity.createdAt.toISOString().split("T")[0];
      activityMap.set(date, (activityMap.get(date) || 0) + activity._count.id);
    });

    // Generate 365 days
    const contributions: ContributionDay[] = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const count = activityMap.get(dateStr) || 0;

      // Calculate level (0-4) for color intensity
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;

      contributions.push({
        date: dateStr,
        count,
        level,
      });
    }

    return contributions;
  },

  /**
   * Calculate contribution streak
   */
  async getStreak(
    userId: string,
  ): Promise<{ current: number; longest: number }> {
    // Get all activities ordered by date
    const activities = await prisma.activity.findMany({
      where: {
        userId: userId,
        type: {
          in: ["commit", "push", "pull_request", "merge"],
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (activities.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Convert to unique dates
    const uniqueDates = new Set(
      activities.map((a: any) => a.createdAt.toISOString().split("T")[0]),
    );
    const sortedDates = Array.from(uniqueDates).sort().reverse();

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { current: currentStreak, longest: longestStreak };
  },

  /**
   * Get total contributions for a year
   */
  async getTotalContributions(
    userId: string,
    year: number = new Date().getFullYear(),
  ): Promise<number> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const count = await prisma.activity.count({
      where: {
        userId: userId,
        type: {
          in: ["commit", "push", "pull_request", "merge"],
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return count;
  },
};
