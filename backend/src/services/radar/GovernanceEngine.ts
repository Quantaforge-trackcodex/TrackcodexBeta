import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class GovernanceEngine {
    async getPermissions(userId: string) {
        const scores = await prisma.userSkillScore.findUnique({ where: { userId } });

        // Default low privileges if no score
        if (!scores) {
            return {
                canAutoMerge: false,
                canCreateOrg: false,
                canUseAdvancedSecurity: false,
                xpMultiplier: 1.0,
                aiAccessLevel: "BASIC"
            };
        }

        return {
            // Quality Gate: Only high quality contributors can auto-merge
            canAutoMerge: scores.quality > 80,

            // Architecture Gate: Only architects can create organizations/workspaces
            canCreateOrg: scores.architecture > 60,

            // Security Gate: Vulnerability scanning requires security trust
            canUseAdvancedSecurity: scores.security > 70,

            // XP Bonus for consistent users
            xpMultiplier: scores.consistency > 90 ? 1.2 : 1.0,

            // AI Capability Unlocks
            aiAccessLevel: scores.coding > 85 ? "AUTONOMOUS" : (scores.coding > 50 ? "ASSISTED" : "BASIC")
        };
    }

    async checkPermission(userId: string, action: string): Promise<boolean> {
        const perms = await this.getPermissions(userId);
        return (perms as any)[action] || false;
    }
}

export const governanceEngine = new GovernanceEngine();
