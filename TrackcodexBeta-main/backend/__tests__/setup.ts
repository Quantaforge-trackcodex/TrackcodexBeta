/* global jest, beforeEach */
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Create the mock instance first
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Mock the whole module
jest.mock('@prisma/client', () => ({
    __esModule: true,
    PrismaClient: jest.fn(() => prismaMock),
}));

// Mock Session Service
jest.mock('../services/session', () => ({
    getSession: jest.fn(async (id: string) => {
        if (id === 'valid-session') {
            return {
                userId: 'user-1',
                email: 'test@example.com',
                role: 'user',
                csrfToken: 'mock-csrf'
            };
        }
        return null;
    }),
    createSession: jest.fn(),
    revokeSession: jest.fn(),
    revokeAllUserSessions: jest.fn()
}));

beforeEach(() => {
    mockReset(prismaMock);
});
