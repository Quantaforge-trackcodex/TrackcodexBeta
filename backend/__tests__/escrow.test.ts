/* global describe, it, expect */
import { prismaMock } from './setup';
import { jobRoutes } from '../routes/jobs';
import Fastify from 'fastify';
import cookie from '@fastify/cookie';

const fastify = Fastify();
fastify.register(cookie);
fastify.register(jobRoutes);

describe('Escrow & Wallet System', () => {

    it('should successfully fund a job escrow', async () => {
        const mockJob = { id: 'job-1', title: 'Test Job', budget: '$500', creatorId: 'user-1' };
        const mockWallet = { id: 'wallet-1', userId: 'user-1', balance: 1000 };

        prismaMock.job.findUnique.mockResolvedValue(mockJob as any);
        prismaMock.wallet.findUnique.mockResolvedValue(mockWallet as any);

        // Mocking transaction
        prismaMock.$transaction.mockImplementation(async (callback) => {
            return await callback(prismaMock);
        });

        const response = await fastify.inject({
            method: 'POST',
            url: '/jobs/job-1/fund',
            headers: { 'x-user-id': 'user-1' }
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body.success).toBe(true);
        expect(body.message).toContain('Funds secured');

        // Verify wallet was decremented
        expect(prismaMock.wallet.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'wallet-1' },
            data: { balance: { decrement: 500 } }
        }));

        // Verify escrow was created
        expect(prismaMock.escrowContract.create).toHaveBeenCalledWith(expect.objectContaining({
            data: {
                jobId: 'job-1',
                amountLocked: 500,
                status: 'HELD'
            }
        }));
    });

    it('should fail to fund if balance is insufficient', async () => {
        const mockJob = { id: 'job-1', title: 'Test Job', budget: '$500', creatorId: 'user-1' };
        const mockWallet = { id: 'wallet-1', userId: 'user-1', balance: 100 };

        prismaMock.job.findUnique.mockResolvedValue(mockJob as any);
        prismaMock.wallet.findUnique.mockResolvedValue(mockWallet as any);

        const response = await fastify.inject({
            method: 'POST',
            url: '/jobs/job-1/fund',
            headers: { 'x-user-id': 'user-1' }
        });

        expect(response.statusCode).toBe(402);
        const body = JSON.parse(response.payload);
        expect(body.error).toBe("Insufficient funds.");
    });

    it('should successfully release payment to freelancer', async () => {
        const mockEscrow = { id: 'escrow-1', jobId: 'job-1', amountLocked: 500, status: 'HELD' };
        const mockFreelancerWallet = { id: 'wallet-2', userId: 'freelancer-1', balance: 0 };

        prismaMock.escrowContract.findUnique.mockResolvedValue(mockEscrow as any);
        prismaMock.wallet.findUnique.mockResolvedValue(mockFreelancerWallet as any);

        prismaMock.$transaction.mockImplementation(async (callback) => {
            return await callback(prismaMock);
        });

        const response = await fastify.inject({
            method: 'POST',
            url: '/jobs/job-1/release',
            headers: {
                'cookie': 'session_id=valid-session',
                'x-csrf-token': 'mock-csrf'
            },
            body: { freelancerId: 'freelancer-1' }
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body.success).toBe(true);

        // Verify escrow released
        expect(prismaMock.escrowContract.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'escrow-1' },
            data: { status: 'RELEASED' }
        }));

        // Verify freelancer credited
        expect(prismaMock.wallet.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'wallet-2' },
            data: { balance: { increment: 500 } }
        }));
    });

});
