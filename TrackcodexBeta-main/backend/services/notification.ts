import { PrismaClient } from '@prisma/client';
import { ChatService } from './chat';

const prisma = new PrismaClient();

export class NotificationService {

    // Create & Broadcast
    static async create(userId: string, type: string, title: string, message: string) {
        try {
            // 1. Save to DB
            const notif = await prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    read: false
                }
            });

            // 2. Push via WebSocket (Using ChatService's connection map)
            ChatService.sendNotification(userId, notif);

            return notif;
        } catch (e) {
            console.error("Failed to create notification", e);
        }
    }

    // Get All for User
    static async getAll(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Mark as Read
    static async markRead(id: string) {
        return prisma.notification.update({
            where: { id },
            data: { read: true }
        });
    }

    // Mark All Read
    static async markAllRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
    }
}
