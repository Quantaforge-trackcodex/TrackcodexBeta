import { FastifyInstance } from 'fastify';
import { DockerService } from '../services/docker';
import { TerminalService } from '../services/terminal';
import path from 'path';
import fs from 'fs/promises';

export async function forgeRoutes(fastify: FastifyInstance) {

    // Terminal WebSocket
    fastify.get('/forge/terminal/:workspaceId', { websocket: true }, (connection, req) => {
        TerminalService.handleConnection(connection, req).catch(err => {
            fastify.log.error("Terminal WebSocket Error: " + err.message);
        });
    });

    // Create Workspace (Docker Container + Local Folder)
    fastify.post('/forge/create', async (request, reply) => {
        const { workspaceId, framework } = request.body as any;

        try {
            const result = await DockerService.createContainer(workspaceId, 'node:18-alpine');

            // Create initial file
            const wsPath = path.resolve(__dirname, `../../workspaces/${workspaceId}`);
            await fs.writeFile(path.join(wsPath, 'index.js'), '// Start coding here\nconsole.log("Hello from The Forge!");');

            return { success: true, containerId: result.containerId };
        } catch (e: any) {
            console.error("Workspace Creation Error:", e);
            return reply.code(500).send({ error: "Failed to create workspace" });
        }
    });

    // File System API
    fastify.get('/forge/files/:workspaceId', async (request, reply) => {
        const { workspaceId } = request.params as any;
        const rootPath = path.resolve(__dirname, `../../workspaces/${workspaceId}`);

        // Recursive file tree (Simplified for demo)
        const getFiles = async (dir: string): Promise<any[]> => {
            const dirents = await fs.readdir(dir, { withFileTypes: true });
            const files = await Promise.all(dirents.map((dirent) => {
                const res = path.resolve(dir, dirent.name);
                return dirent.isDirectory() ? getFiles(res) : res;
            }));
            return Array.prototype.concat(...files);
        };

        try {
            const files = await getFiles(rootPath);
            // Convert to relative paths
            return files.map(f => f.replace(rootPath, '').replace(/\\/g, '/'));
        } catch (e) {
            return [];
        }
    });

    // Read File Content
    fastify.get('/forge/files/:workspaceId/content', async (request, reply) => {
        const { workspaceId } = request.params as any;
        const { path: filePath } = request.query as any;

        if (!filePath) return reply.code(400).send({ error: "File path required" });

        // Security: Prevent directory traversal
        if (filePath.includes('..')) return reply.code(403).send({ error: "Invalid path" });

        const fullPath = path.resolve(__dirname, `../../workspaces/${workspaceId}`, filePath);

        try {
            const content = await fs.readFile(fullPath, 'utf-8');
            return { content };
        } catch (e) {
            return reply.code(404).send({ error: "File not found" });
        }
    });

    // Write File Content
    fastify.post('/forge/files/:workspaceId/save', async (request, reply) => {
        const { workspaceId } = request.params as any;
        const { path: filePath, content } = request.body as any;

        if (!filePath || content === undefined) return reply.code(400).send({ error: "Path and content required" });
        if (filePath.includes('..')) return reply.code(403).send({ error: "Invalid path" });

        const fullPath = path.resolve(__dirname, `../../workspaces/${workspaceId}`, filePath);

        try {
            await fs.writeFile(fullPath, content);
            return { success: true };
        } catch (e) {
            return reply.code(500).send({ error: "Failed to save file" });
        }
    });

    // Git Push Guard (Governance Logic)
    fastify.post('/forge/git/push', async (request, reply) => {
        const { repoId, userId } = request.body as any;

        // Mock Repository Governance Check
        // In real app, we check DB: prisma.repository.findUnique(...)

        // Simulating logic based on "Solo" vs "Team"
        // Let's check a mock "contributors" count. 
        // If repoId ends in 'solo', we treat as solo. Else team.

        const isSoloRepo = repoId.endsWith('-solo');

        if (isSoloRepo) {
            return { success: true, message: "Push allowed (Solo Developer Mode)." };
        } else {
            // Team Mode -> Check for Approved PR
            // Mock: We fail unless 'prStatus' is approved
            const { prStatus } = request.body as any;

            if (prStatus !== 'APPROVED') {
                return reply.code(403).send({
                    error: "Push Rejected: Admin Approval Required.",
                    details: "This repository is in Team Mode. Direct pushes are blocked. Please submit a Pull Request and wait for Admin Approval (AHI Risk Score check)."
                });
            }

            return { success: true, message: "Push allowed (PR Approved)." };
        }
    });
}
