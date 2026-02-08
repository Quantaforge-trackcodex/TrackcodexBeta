import { FastifyInstance } from 'fastify';
import { NotificationService } from '../services/notification';

export async function notificationRoutes(fastify: FastifyInstance) {

    // Get My Notifications
    fastify.get('/notifications', async (request, reply) => {
        const { userId } = request.query as any; // In real app, from Token
        if (!userId) return reply.code(400).send({ error: "UserId required" });

        try {
            const list = await NotificationService.getAll(userId);
            return list;
        } catch (error: any) {
            console.error("[Notifications] Error fetching:", error.message);
            // Return empty array instead of 500 to prevent UI crashes
            return [];
        }
    });

    // Mark Read
    fastify.post('/notifications/:id/read', async (request, reply) => {
        const { id } = request.params as any;
        await NotificationService.markRead(id);
        return { success: true };
    });

    // Mark All Read
    fastify.post('/notifications/read-all', async (request, reply) => {
        const { userId } = request.body as any;
        await NotificationService.markAllRead(userId);
        return { success: true };
    });
}
