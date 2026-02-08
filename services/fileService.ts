const API_BASE = 'http://localhost:4000/api/v1/forge';

export const fileService = {
    // Get File Tree
    async getFiles(workspaceId: string) {
        const res = await fetch(`${API_BASE}/files/${workspaceId}`);
        if (!res.ok) throw new Error('Failed to fetch files');
        return res.json();
    },

    // Get File Content
    async getFileContent(workspaceId: string, path: string) {
        const res = await fetch(`${API_BASE}/files/${workspaceId}/content?path=${encodeURIComponent(path)}`);
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
    },

    // Save File
    async saveFile(workspaceId: string, path: string, content: string) {
        const res = await fetch(`${API_BASE}/files/${workspaceId}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, content })
        });
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
    },

    // Git Push (Governance)
    async gitPush(repoId: string, userId: string, prStatus?: string) {
        const res = await fetch(`${API_BASE}/git/push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoId, userId, prStatus })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Push failed');
        return data;
    }
};
