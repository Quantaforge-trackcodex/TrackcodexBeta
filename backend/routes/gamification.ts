import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import {
    calculateLevelFromXP,
    calculateXPForLevel,
    calculateLevelProgress,
    getRankFromLevel
} from '../services/gamification';

const prisma = new PrismaClient();

export async function gamificationRoutes(fastify: FastifyInstance) {
    // Get user's gamification profile
    fastify.get('/api/v1/gamification/profile', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const userId = (request.user as any)?.id;
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            let user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    characterId: true,
                    characterName: true,
                    experiencePoints: true,
                    level: true,
                    rank: true,
                    levelProgress: true
                }
            });

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Initialize gamification fields if they're null
            if (user.experiencePoints === null || user.level === null) {
                user = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        experiencePoints: 0,
                        level: 1,
                        rank: 'Novice',
                        levelProgress: 0
                    },
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        characterId: true,
                        characterName: true,
                        experiencePoints: true,
                        level: true,
                        rank: true,
                        levelProgress: true
                    }
                });
            }

            const nextLevelXP = calculateXPForLevel(user.level! + 1);
            const currentLevelXP = calculateXPForLevel(user.level!);

            return reply.send({
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    characterId: user.characterId,
                    characterName: user.characterName
                },
                xp: user.experiencePoints || 0,
                level: user.level || 1,
                rank: user.rank || 'Novice',
                levelProgress: user.levelProgress || 0,
                xpForNextLevel: nextLevelXP,
                xpIntoCurrentLevel: (user.experiencePoints || 0) - currentLevelXP,
                xpNeededForNextLevel: nextLevelXP - (user.experiencePoints || 0)
            });
        } catch (error) {
            console.error('Error fetching gamification profile:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Get leaderboard
    fastify.get('/api/v1/gamification/leaderboard', async (request, reply) => {
        try {
            const { limit = '100' } = request.query as { limit?: string };
            const limitNum = Math.min(parseInt(limit, 10), 200);

            const topUsers = await prisma.user.findMany({
                where: {
                    deletedAt: null
                },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    characterId: true,
                    characterName: true,
                    experiencePoints: true,
                    level: true,
                    rank: true
                },
                orderBy: [
                    { experiencePoints: 'desc' },
                    { level: 'desc' }
                ],
                take: limitNum
            });

            return reply.send({
                leaderboard: topUsers.map((user, index) => ({
                    position: index + 1,
                    ...user
                }))
            });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Get point transaction history
    fastify.get('/api/v1/gamification/history', async (request, reply) => {
        try {
            const userId = (request.user as any)?.id;
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const { limit = '50', offset = '0' } = request.query as { limit?: string; offset?: string };

            const transactions = await prisma.pointTransaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit, 10),
                skip: parseInt(offset, 10),
                select: {
                    id: true,
                    points: true,
                    activity: true,
                    metadata: true,
                    createdAt: true
                }
            });

            const total = await prisma.pointTransaction.count({
                where: { userId }
            });

            return reply.send({
                transactions,
                total,
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            });
        } catch (error) {
            console.error('Error fetching transaction history:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Get all available achievements
    fastify.get('/api/v1/gamification/achievements', async (request, reply) => {
        try {
            const achievements = await prisma.achievement.findMany({
                orderBy: [
                    { tier: 'asc' },
                    { points: 'asc' }
                ]
            });

            return reply.send({ achievements });
        } catch (error) {
            console.error('Error fetching achievements:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Get user's unlocked achievements
    fastify.get('/api/v1/gamification/achievements/user/:userId', async (request, reply) => {
        try {
            const { userId } = request.params as { userId: string };

            const userAchievements = await prisma.userAchievement.findMany({
                where: { userId },
                include: {
                    achievement: true
                },
                orderBy: { unlockedAt: 'desc' }
            });

            return reply.send({
                achievements: userAchievements.map(ua => ({
                    ...ua.achievement,
                    unlockedAt: ua.unlockedAt
                }))
            });
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
