import { User, Enterprise, EnterpriseMember, Repository } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      userId: string;
      role: string;
      name?: string;
      username?: string;
      email?: string;
    } & Partial<User>;
    enterprise?: Enterprise;
    enterpriseMember?: EnterpriseMember;
    repository?: Repository;
    repoPermission?: string;
    enterpriseId?: string; // Access context
    cookies: { [key: string]: string | undefined };
    csrfToken?: string;
  }
}
