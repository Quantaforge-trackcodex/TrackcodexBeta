import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const toGlobalId = (type: string, id: string) =>
  Buffer.from(`${type}:${id}`).toString("base64");
const fromGlobalId = (globalId: string) => {
  const decoded = Buffer.from(globalId, "base64").toString("ascii");
  const [type, id] = decoded.split(":");
  return { type, id };
};

export const resolvers = {
  Query: {
    node: async (_: any, { id }: { id: string }) => {
      const { type, id: dbId } = fromGlobalId(id);
      switch (type) {
        case "User":
          return await prisma.user.findUnique({ where: { id: dbId } });
        case "Repository":
          return await prisma.repository.findUnique({ where: { id: dbId } });
        case "Organization":
          return await prisma.organization.findUnique({ where: { id: dbId } });
        default:
          return null;
      }
    },
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return await prisma.user.findUnique({
        where: { id: context.user.userId },
      });
    },
    user: async (_: any, { username }: { username: string }) => {
      return await prisma.user.findUnique({ where: { username } });
    },
    repository: async (
      _: any,
      { owner, name }: { owner: string; name: string },
    ) => {
      const repo = await prisma.repository.findFirst({
        where: {
          name,
          OR: [{ owner: { username: owner } }],
        },
        include: { owner: true },
      });
      return repo;
    },
    organization: async (_: any, { slug }: { slug: string }) => {
      return await prisma.organization.findFirst({ where: { slug } });
    },
  },

  // Interface Resolver
  Node: {
    __resolveType(obj: any) {
      if (obj.username) return "User";
      if (obj.slug) return "Organization";
      if (obj.isPrivate !== undefined) return "Repository";
      return null;
    },
  },

  Mutation: {
    createRepository: async (
      _: any,
      { name, description, visibility }: any,
      context: any,
    ) => {
      if (!context.user) throw new Error("Unauthorized");
      return await prisma.repository.create({
        data: {
          name,
          description,
          visibility: visibility?.toUpperCase() || "PUBLIC",
          ownerId: context.user.userId,
        },
      });
    },
  },
  User: {
    id: (parent: any) => toGlobalId("User", parent.id),
    repositories: async (parent: any, { limit }: any) => {
      return await prisma.repository.findMany({
        where: { ownerId: parent.id },
        take: limit || 10,
      });
    },
    organizations: async (parent: any) => {
      const memberships = await prisma.orgMember.findMany({
        where: { userId: parent.id },
        include: { org: true },
      });
      return memberships.map((m) => m.org);
    },
  },
  Repository: {
    id: (parent: any) => toGlobalId("Repository", parent.id),
    owner: async (parent: any) => {
      if (parent.owner) return parent.owner; // If included
      return await prisma.user.findUnique({ where: { id: parent.ownerId } });
    },
    organization: async (parent: any) => {
      if (!parent.orgId) return null;
      return await prisma.organization.findUnique({
        where: { id: parent.orgId },
      });
    },
  },
  Organization: {
    id: (parent: any) => toGlobalId("Organization", parent.id),
    members: async (parent: any) => {
      const memberships = await prisma.orgMember.findMany({
        where: { orgId: parent.id },
        include: { user: true },
      });
      return memberships.map((m) => m.user);
    },
    repositories: async (parent: any) => {
      return await prisma.repository.findMany({
        where: { orgId: parent.id },
      });
    },
  },
};
