import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PortfolioItemData {
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
  technologies: string[];
  featured?: boolean;
  order?: number;
}

export class PortfolioService {
  /**
   * Create a new portfolio item
   */
  static async createPortfolioItem(
    userId: string,
    data: PortfolioItemData,
  ): Promise<{ success: boolean; item?: any; error?: string }> {
    try {
      // Check portfolio item count (max 20)
      const count = await prisma.portfolioItem.count({
        where: { userId },
      });

      if (count >= 20) {
        return {
          success: false,
          error: "Maximum portfolio items limit reached (20)",
        };
      }

      // Get next order number
      const maxOrder = await prisma.portfolioItem.findFirst({
        where: { userId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const item = await prisma.portfolioItem.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          demoUrl: data.demoUrl,
          sourceUrl: data.sourceUrl,
          technologies: data.technologies,
          featured: data.featured || false,
          order: data.order ?? (maxOrder?.order ?? 0) + 1,
        },
      });

      return { success: true, item };
    } catch (error) {
      console.error("Create portfolio item error:", error);
      return { success: false, error: "Failed to create portfolio item" };
    }
  }

  /**
   * Get all portfolio items for a user
   */
  static async getUserPortfolioItems(userId: string) {
    try {
      const items = await prisma.portfolioItem.findMany({
        where: { userId },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      });

      return { success: true, items };
    } catch (error) {
      console.error("Get portfolio items error:", error);
      return { success: false, error: "Failed to fetch portfolio items" };
    }
  }

  /**
   * Update a portfolio item
   */
  static async updatePortfolioItem(
    itemId: string,
    userId: string,
    data: Partial<PortfolioItemData>,
  ): Promise<{ success: boolean; item?: any; error?: string }> {
    try {
      // Verify ownership
      const existing = await prisma.portfolioItem.findUnique({
        where: { id: itemId },
      });

      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Portfolio item not found" };
      }

      const item = await prisma.portfolioItem.update({
        where: { id: itemId },
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          demoUrl: data.demoUrl,
          sourceUrl: data.sourceUrl,
          technologies: data.technologies,
          featured: data.featured,
          order: data.order,
        },
      });

      return { success: true, item };
    } catch (error) {
      console.error("Update portfolio item error:", error);
      return { success: false, error: "Failed to update portfolio item" };
    }
  }

  /**
   * Delete a portfolio item
   */
  static async deletePortfolioItem(
    itemId: string,
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify ownership
      const existing = await prisma.portfolioItem.findUnique({
        where: { id: itemId },
      });

      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Portfolio item not found" };
      }

      await prisma.portfolioItem.delete({
        where: { id: itemId },
      });

      return { success: true };
    } catch (error) {
      console.error("Delete portfolio item error:", error);
      return { success: false, error: "Failed to delete portfolio item" };
    }
  }

  /**
   * Reorder portfolio items
   */
  static async reorderPortfolioItems(
    userId: string,
    itemIds: string[],
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update order for each item
      await Promise.all(
        itemIds.map((id, index) =>
          prisma.portfolioItem.updateMany({
            where: { id, userId }, // Verify ownership
            data: { order: index },
          }),
        ),
      );

      return { success: true };
    } catch (error) {
      console.error("Reorder portfolio items error:", error);
      return { success: false, error: "Failed to reorder portfolio items" };
    }
  }

  /**
   * Toggle featured status (pinned)
   */
  static async toggleFeatured(
    itemId: string,
    userId: string,
    featured: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check pinned items count (max 6 total across repos + portfolio)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { pinnedItems: true },
      });

      if (featured && (user?.pinnedItems.length ?? 0) >= 6) {
        return {
          success: false,
          error: "Maximum pinned items limit reached (6)",
        };
      }

      // Verify ownership
      const existing = await prisma.portfolioItem.findUnique({
        where: { id: itemId },
      });

      if (!existing || existing.userId !== userId) {
        return { success: false, error: "Portfolio item not found" };
      }

      await prisma.portfolioItem.update({
        where: { id: itemId },
        data: { featured },
      });

      // Update pinnedItems array
      if (featured) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            pinnedItems: { push: `portfolio:${itemId}` },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: {
            pinnedItems: user?.pinnedItems.filter(
              (id) => id !== `portfolio:${itemId}`,
            ),
          },
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Toggle featured error:", error);
      return { success: false, error: "Failed to toggle featured status" };
    }
  }

  /**
   * Update portfolio visibility
   */
  static async updateVisibility(
    userId: string,
    showPortfolio?: boolean,
    showRepositories?: boolean,
    showContributions?: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          showPortfolio,
          showRepositories,
          showContributions,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Update visibility error:", error);
      return { success: false, error: "Failed to update visibility settings" };
    }
  }
}
