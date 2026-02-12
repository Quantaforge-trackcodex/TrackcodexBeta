import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Level progression curve - exponential growth
 * Formula: XP_required = 100 * (level ^ 1.5)
 */
export function calculateLevelFromXP(xp: number): number {
    if (xp === 0) return 1;

    // Inverse of: XP = 100 * level^1.5
    // level = (XP / 100) ^ (1 / 1.5)
    const level = Math.floor(Math.pow(xp / 100, 1 / 1.5));
    return Math.max(1, Math.min(level, 100)); // Clamp between 1-100
}

/**
 * Calculate total XP required to reach a specific level
 */
export function calculateXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate XP required for next level
 */
export function calculateXPForNextLevel(currentLevel: number): number {
    return calculateXPForLevel(currentLevel + 1);
}

/**
 * Calculate progress percentage to next level (0-100)
 */
export function calculateLevelProgress(currentXP: number, currentLevel: number): number {
    const currentLevelXP = calculateXPForLevel(currentLevel);
    const nextLevelXP = calculateXPForLevel(currentLevel + 1);
    const xpIntoLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    const progress = (xpIntoLevel / xpNeededForLevel) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp 0-100
}

/**
 * Determine rank based on level
 */
export function getRankFromLevel(level: number): string {
    if (level >= 100) return 'Legend';
    if (level >= 75) return 'Diamond';
    if (level >= 50) return 'Platinum';
    if (level >= 25) return 'Gold';
    if (level >= 10) return 'Silver';
    if (level >= 5) return 'Bronze';
    return 'Novice';
}

/**
 * Award points to a user for an activity
 */
export async function awardPoints(
    userId: string,
    activity: string,
    points: number,
    metadata?: any
): Promise<{ newXP: number; newLevel: number; newRank: string; leveledUp: boolean }> {
    // Create point transaction
    await prisma.pointTransaction.create({
        data: {
            userId,
            points,
            activity,
            metadata: metadata || {}
        }
    });

    // Get current user state
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { experiencePoints: true, level: true }
    });

    if (!user) throw new Error('User not found');

    const oldLevel = user.level;
    const newXP = user.experiencePoints + points;
    const newLevel = calculateLevelFromXP(newXP);
    const newRank = getRankFromLevel(newLevel);
    const levelProgress = calculateLevelProgress(newXP, newLevel);

    // Update user
    await prisma.user.update({
        where: { id: userId },
        data: {
            experiencePoints: newXP,
            level: newLevel,
            rank: newRank,
            levelProgress
        }
    });

    const leveledUp = newLevel > oldLevel;

    return { newXP, newLevel, newRank, leveledUp };
}

/**
 * Point values for different activities
 */
export const ACTIVITY_POINTS = {
    // Account & Profile
    ACCOUNT_CREATED: 100,
    PROFILE_COMPLETED: 50,

    // Repositories
    REPO_CREATED: 50,
    REPO_FORKED: 15,
    REPO_STARRED: 1,

    // Code Activity
    COMMIT_PUSHED: 5,

    // Issues
    ISSUE_CREATED: 10,
    ISSUE_RESOLVED: 25,
    ISSUE_COMMENTED: 2,

    // Pull Requests
    PR_CREATED: 20,
    PR_MERGED: 50,
    PR_REVIEWED: 15,
    PR_COMMENTED: 2,

    // Workspace
    WORKSPACE_CREATED: 30,
    WORKSPACE_SHARED: 10,

    // Social
    COMMENT_POSTED: 2,
    USER_FOLLOWED: 5,
    ORG_JOINED: 75,

    // Jobs & Freelancing
    JOB_POSTED: 30,
    JOB_APPLICATION_SUBMITTED: 10,
    JOB_COMPLETED: 100
} as const;

/**
 * Check and award achievements for a user based on activity
 */
export async function checkAchievements(userId: string, activity: string): Promise<string[]> {
    // This will be expanded later with specific achievement logic
    const unlockedAchievements: string[] = [];

    // Example: First repo achievement
    if (activity === 'REPO_CREATED') {
        const userRepoCount = await prisma.workspace.count({
            where: { userId }
        });

        if (userRepoCount === 1) {
            const achievement = await prisma.achievement.findUnique({
                where: { key: 'FIRST_REPO' }
            });

            if (achievement) {
                // Check if not already unlocked
                const existing = await prisma.userAchievement.findUnique({
                    where: {
                        userId_achievementId: {
                            userId,
                            achievementId: achievement.id
                        }
                    }
                });

                if (!existing) {
                    await prisma.userAchievement.create({
                        data: {
                            userId,
                            achievementId: achievement.id
                        }
                    });

                    // Award bonus points for achievement
                    await awardPoints(userId, 'ACHIEVEMENT_UNLOCKED', achievement.points, {
                        achievementKey: achievement.key
                    });

                    unlockedAchievements.push(achievement.key);
                }
            }
        }
    }

    return unlockedAchievements;
}
