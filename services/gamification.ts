import { api } from './api';

export interface GamificationProfile {
    user: {
        id: string;
        username: string | null;
        name: string | null;
        characterId: string | null;
        characterName: string | null;
    };
    xp: number;
    level: number;
    rank: string;
    levelProgress: number;
    xpForNextLevel: number;
    xpIntoCurrentLevel: number;
    xpNeededForNextLevel: number;
}

export interface LeaderboardEntry {
    position: number;
    id: string;
    username: string | null;
    name: string | null;
    characterId: string | null;
    characterName: string | null;
    experiencePoints: number;
    level: number;
    rank: string;
}

export interface PointTransaction {
    id: string;
    points: number;
    activity: string;
    metadata: any;
    createdAt: string;
}

export interface Achievement {
    id: string;
    key: string;
    name: string;
    description: string;
    icon: string | null;
    points: number;
    tier: string;
    unlockedAt?: string;
}

export const gamificationApi = {
    getProfile: async (): Promise<GamificationProfile> => {
        const response = await api.get<GamificationProfile>('/gamification/profile');
        return response;
    },

    getLeaderboard: async (limit = 100): Promise<LeaderboardEntry[]> => {
        const response = await api.get<{ leaderboard: LeaderboardEntry[] }>(`/gamification/leaderboard?limit=${limit}`);
        return (response as any).leaderboard || [];
    },

    getHistory: async (limit = 50, offset = 0): Promise<{ transactions: PointTransaction[]; total: number }> => {
        const response = await api.get<{ transactions: PointTransaction[]; total: number }>(`/gamification/history?limit=${limit}&offset=${offset}`);
        return response;
    },

    getAchievements: async (): Promise<Achievement[]> => {
        const response = await api.get<{ achievements: Achievement[] }>('/gamification/achievements');
        return (response as any).achievements || [];
    },

    getUserAchievements: async (userId: string): Promise<Achievement[]> => {
        const response = await api.get<{ achievements: Achievement[] }>(`/gamification/achievements/user/${userId}`);
        return (response as any).achievements || [];
    }
};
