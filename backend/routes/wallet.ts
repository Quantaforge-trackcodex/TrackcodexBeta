import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Ideally import from shared lib if available

export async function walletRoutes(fastify: FastifyInstance) {

    // Get Current Balance
    fastify.get('/balance', async (request: FastifyRequest, reply: FastifyReply) => {
        // Mock user ID for now, in prod use request.user.id
        const userId = (request.headers['x-user-id'] as string) || 'user-1';

        let wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) {
            // Auto-create wallet if missing (Simulated onboarding)
            wallet = await prisma.wallet.create({
                data: { userId, balance: 0.00 }
            });
        }

        return {
            currency: wallet.currency,
            available: wallet.balance,
            in_escrow: 0.00 // TODO: Sum from EscrowContract
        };
    });

    // Deposit Funds (Simulated Stripe)
    fastify.post('/deposit', async (request: any, reply) => {
        const userId = request.headers['x-user-id'] || 'user-1';
        const { amount } = request.body;

        if (!amount || amount <= 0) {
            return reply.code(400).send({ error: "Invalid amount" });
        }

        // 1. Get/Create Wallet
        let wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) wallet = await prisma.wallet.create({ data: { userId, balance: 0 } });

        // 2. Create Transaction Record
        await prisma.transaction.create({
            data: {
                walletId: wallet.id,
                amount: amount,
                type: 'DEPOSIT',
                description: 'Bank Transfer (Simulated)',
                status: 'COMPLETED'
            }
        });

        // 3. Update Balance
        const updatedWallet = await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: { increment: amount } }
        });

        return { success: true, newBalance: updatedWallet.balance };
    });

    // Get Transactions
    fastify.get('/transactions', async (request: any, reply) => {
        const userId = request.headers['x-user-id'] || 'user-1';
        const wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) return [];

        const txs = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        return txs;
    });
}
