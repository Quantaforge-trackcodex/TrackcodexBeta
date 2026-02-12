import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function characterRoutes(fastify: FastifyInstance) {
    // Get all available characters
    fastify.get('/api/v1/characters', async (request, reply) => {
        try {
            const characters = await prisma.character.findMany({
                orderBy: { createdAt: 'asc' }
            });

            return reply.send({ characters });
        } catch (error) {
            console.error('Error fetching characters:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Get specific character by key
    fastify.get('/api/v1/characters/:key', async (request, reply) => {
        try {
            const { key } = request.params as { key: string };

            const character = await prisma.character.findUnique({
                where: { key }
            });

            if (!character) {
                return reply.status(404).send({ error: 'Character not found' });
            }

            return reply.send({ character });
        } catch (error) {
            console.error('Error fetching character:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Select character for user (during signup/login)
    fastify.post('/api/v1/characters/select', async (request, reply) => {
        try {
            const userId = (request.user as any)?.id;
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            const { characterKey } = request.body as { characterKey: string };

            if (!characterKey) {
                return reply.status(400).send({ error: 'Character key is required' });
            }

            // Verify character exists
            const character = await prisma.character.findUnique({
                where: { key: characterKey }
            });

            if (!character) {
                return reply.status(404).send({ error: 'Character not found' });
            }

            // Update user's character selection
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    characterId: character.key,
                    characterName: character.name,
                    experiencePoints: {
                        increment: character.startingXP
                    }
                },
                select: {
                    id: true,
                    username: true,
                    characterId: true,
                    characterName: true,
                    experiencePoints: true,
                    level: true,
                    rank: true
                }
            });

            return reply.send({
                message: 'Character selected successfully',
                user: updatedUser,
                character
            });
        } catch (error) {
            console.error('Error selecting character:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    // Update user's character
    fastify.put('/api/v1/users/:userId/character', async (request, reply) => {
        try {
            const requestUserId = (request.user as any)?.id;
            const { userId } = request.params as { userId: string };

            // Users can only update their own character
            if (requestUserId !== userId) {
                return reply.status(403).send({ error: 'Forbidden' });
            }

            const { characterKey } = request.body as { characterKey: string };

            if (!characterKey) {
                return reply.status(400).send({ error: 'Character key is required' });
            }

            // Verify character exists
            const character = await prisma.character.findUnique({
                where: { key: characterKey }
            });

            if (!character) {
                return reply.status(404).send({ error: 'Character not found' });
            }

            // Update user's character (no XP bonus for changing)
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    characterId: character.key,
                    characterName: character.name
                },
                select: {
                    id: true,
                    username: true,
                    characterId: true,
                    characterName: true
                }
            });

            return reply.send({
                message: 'Character updated successfully',
                user: updatedUser,
                character
            });
        } catch (error) {
            console.error('Error updating character:', error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
