
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';
import { logSensitiveOperation } from '../services/auditLogger';
import { revokeAllUserSessions } from '../services/session';

const prisma = new PrismaClient();

export async function adminRoutes(fastify: FastifyInstance) {

    // Protect all admin routes
    fastify.addHook('preHandler', requireRole('admin'));

    // List Users (Paginated & Searchable)
    fastify.get('/admin/users', async (request, reply) => {
        const { page = 1, limit = 20, search } = request.query as any;
        const skip = (Number(page) - 1) * Number(limit);

        try {
            const whereClause = search ? {
                OR: [
                    { email: { contains: search } },
                    { username: { contains: search } }
                ]
            } : {};

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        role: true,
                        accountLocked: true,
                        createdAt: true,
                        _count: { select: { sessions: true } }
                    }
                }),
                prisma.user.count({ where: whereClause })
            ]);

            return {
                data: users,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / Number(limit))
                }
            };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch users' });
        }
    });

    // Ban User
    fastify.post('/admin/users/:userId/ban', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const { reason } = request.body as { reason?: string };
        const adminUser = (request as any).user;

        try {
            // Prevent self-ban
            if (userId === adminUser.userId) {
                return reply.code(400).send({ error: 'Cannot ban yourself' });
            }

            // Lock account
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { accountLocked: true }
            });

            // Revoke sessions
            await revokeAllUserSessions(userId);

            // Audit
            await logSensitiveOperation(
                adminUser.userId,
                'ban_user',
                'user',
                userId,
                request.ip,
                request.headers['user-agent'] || 'system',
                true,
                { reason }
            );

            return { message: `User ${updatedUser.email} has been banned and sessions revoked.` };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to ban user' });
        }
    });

    // Unban User
    fastify.post('/admin/users/:userId/unban', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const adminUser = (request as any).user;

        try {
            await prisma.user.update({
                where: { id: userId },
                data: { accountLocked: false }
            });

            await logSensitiveOperation(
                adminUser.userId,
                'unban_user',
                'user',
                userId,
                request.ip,
                request.headers['user-agent'] || 'system',
                true
            );

            return { message: 'User unbanned' };
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Failed to unban user' });
        }
    });
}
