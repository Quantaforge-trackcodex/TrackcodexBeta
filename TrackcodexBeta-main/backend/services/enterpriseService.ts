import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EnterpriseService {
  /**
   * Create a new Enterprise and make the creator the OWNER
   */
  static async createEnterprise(
    userId: string,
    data: { name: string; slug: string; plan?: string },
  ) {
    // Transaction to ensure atomic creation
    return await prisma.$transaction(async (tx) => {
      const enterprise = await tx.enterprise.create({
        data: {
          name: data.name,
          slug: data.slug,
          plan: data.plan || "FREE",
          members: {
            create: {
              userId,
              role: "OWNER",
            },
          },
        },
      });
      return enterprise;
    });
  }

  /**
   * Get Enterprise details by slug
   */
  static async getBySlug(slug: string) {
    return await prisma.enterprise.findUnique({
      where: { slug },
      include: {
        organizations: true, // Workspaces
        _count: {
          select: { members: true },
        },
      },
    });
  }

  /**
   * Add a member to the Enterprise
   */
  static async addMember(
    slug: string,
    userId: string,
    role: string = "MEMBER",
  ) {
    const enterprise = await prisma.enterprise.findUnique({ where: { slug } });
    if (!enterprise) throw new Error("Enterprise not found");

    return await prisma.enterpriseMember.create({
      data: {
        enterpriseId: enterprise.id,
        userId,
        role,
      },
    });
  }

  /**
   * Update a member's role
   */
  static async updateMemberRole(slug: string, userId: string, role: string) {
    const enterprise = await prisma.enterprise.findUnique({ where: { slug } });
    if (!enterprise) throw new Error("Enterprise not found");

    return await prisma.enterpriseMember.update({
      where: {
        enterpriseId_userId: {
          enterpriseId: enterprise.id,
          userId,
        },
      },
      data: { role },
    });
  }

  /**
   * List Enterprise members with profile info
   */
  static async getMembers(slug: string) {
    const enterprise = await prisma.enterprise.findUnique({ where: { slug } });
    if (!enterprise) throw new Error("Enterprise not found");

    return await prisma.enterpriseMember.findMany({
      where: { enterpriseId: enterprise.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });
  }

  /**
   * Remove a member
   */
  static async removeMember(slug: string, userId: string) {
    const enterprise = await prisma.enterprise.findUnique({ where: { slug } });
    if (!enterprise) throw new Error("Enterprise not found");

    return await prisma.enterpriseMember.deleteMany({
      where: {
        enterpriseId: enterprise.id,
        userId,
      },
    });
  }

  /**
   * Get all enterprises a user belongs to
   */
  static async getUserEnterprises(userId: string) {
    return await prisma.enterprise.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }
}
