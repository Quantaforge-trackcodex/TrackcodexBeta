import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum OrgRole {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    GUEST = 'GUEST'
}

export const RoleHierarchy = {
    [OrgRole.OWNER]: 4,
    [OrgRole.ADMIN]: 3,
    [OrgRole.MEMBER]: 2,
    [OrgRole.GUEST]: 1
};

export class RoleGuard {

    // Check if user has at least the required role
    static async hasRole(userId: string, orgId: string, requiredRole: OrgRole): Promise<boolean> {
        const member = await prisma.orgMember.findUnique({
            where: {
                orgId_userId: {
                    orgId,
                    userId
                }
            }
        });

        if (!member) return false;

        // "member.role" is a string from DB (or Enum if Prisma typed correctly), assuming Enum match
        // But Prisma returns strings at runtime sometimes unless typed strictly.
        // We cast to our local Enum or use the Hierarchy map.

        const userLevel = RoleHierarchy[member.role as OrgRole] || 0;
        const requiredLevel = RoleHierarchy[requiredRole];

        return userLevel >= requiredLevel;
    }

    // specific check for Owner
    static async isOwner(userId: string, orgId: string): Promise<boolean> {
        return this.hasRole(userId, orgId, OrgRole.OWNER);
    }
}
