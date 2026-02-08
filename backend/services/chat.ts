import { SocketStream } from '@fastify/websocket';
import { FastifyRequest, FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';

const prisma = new PrismaClient();

// In-memory store of connected users: userId -> WebSocket[]
const connections = new Map<string, Set<WebSocket>>();

export class ChatService {

    static async handleConnection(connection: SocketStream, req: FastifyRequest) {
        const socket = connection.socket;
        // In real app, extract userId from JWT token in query/headers
        // For demo, we pass userId in query param: /api/v1/chat?userId=...
        const { userId } = req.query as any;

        if (!userId) {
            socket.close();
            return;
        }

        console.log(`💬 User connected to Chat: ${userId}`);

        // Add to connections
        if (!connections.has(userId)) {
            connections.set(userId, new Set());
        }
        connections.get(userId)!.add(socket);

        // Handle Messages
        socket.on('message', async (data: string) => {
            try {
                const payload = JSON.parse(data.toString());

                // Expect { type: 'dm', receiverId: '...', content: '...' }
                if (payload.type === 'dm') {
                    const { receiverId, content } = payload;

                    // 1. Save to DB
                    const msg = await prisma.message.create({
                        data: {
                            senderId: userId,
                            receiverId,
                            content
                        }
                    });

                    // 2. Send to Receiver (if online)
                    const receiverSockets = connections.get(receiverId);
                    if (receiverSockets) {
                        receiverSockets.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'dm',
                                    message: msg
                                }));
                            }
                        });
                    }

                    // 3. Send confirmation to Sender (optional, or just rely on optimistic UI)
                    socket.send(JSON.stringify({ type: 'ack', id: msg.id }));
                }

            } catch (e) {
                console.error("Chat Error:", e);
            }
        });

        socket.on('close', () => {
            const userConns = connections.get(userId);
            if (userConns) {
                userConns.delete(socket);
                if (userConns.size === 0) connections.delete(userId);
            }
        });
    }

    // Helper to send system notification
    static sendNotification(userId: string, notification: any) {
        const userConns = connections.get(userId);
        if (userConns) {
            userConns.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'notification', data: notification }));
                }
            });
        }
    }
}
