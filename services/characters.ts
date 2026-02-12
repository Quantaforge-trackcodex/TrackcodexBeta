import { api } from './api';

export interface Character {
    id: string;
    key: string;
    name: string;
    description: string;
    color: string;
    theme: string;
    classType: string;
    avatarUrl: string;
    startingXP: number;
    createdAt: string;
}

export const charactersApi = {
    getAll: async (): Promise<Character[]> => {
        const response = await api.get<{ characters: Character[] }>('/characters');
        return (response as any).characters || [];
    },

    getByKey: async (key: string): Promise<Character> => {
        const response = await api.get<{ character: Character }>(`/characters/${key}`);
        return (response as any).character;
    },

    selectCharacter: async (characterKey: string): Promise<any> => {
        const response = await api.post<any>('/characters/select', { characterKey });
        return response;
    },

    updateUserCharacter: async (userId: string, characterKey: string): Promise<any> => {
        const response = await api.put<any>(`/users/${userId}/character`, { characterKey });
        return response;
    }
};

// Helper functions
export function getCharacterColor(characterKey: string): string {
    const colors: Record<string, string> = {
        blaze: '#FF6B35',
        aqua: '#00D4FF',
        shadow: '#2C3E50',
        steel: '#5DADE2',
        mystic: '#3498DB',
        rose: '#FF69B4',
        frost: '#89CFF0',
        dusk: '#F39C12',
        ember: '#E74C3C',
        void: '#9B59B6',
        spark: '#FF8C00',
        sage: '#27AE60'
    };
    return colors[characterKey] || '#6C757D';
}

export function getCharacterAvatar(characterKey: string): string {
    return `/assets/characters/${characterKey}.png`;
}
