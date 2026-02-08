import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { communityRoutes } from "./routes/community";
import { forgeAIRoutes } from "./routes/forgeai";
import { cloudRoutes } from "./routes/cloud";

import { walletRoutes } from "./routes/wallet";

export async function routes(fastify: FastifyInstance) {
  fastify.register(walletRoutes, { prefix: "/api/v1/wallet" });
  fastify.register(forgeAIRoutes, { prefix: "/api/v1/forgeai" });
  fastify.register(cloudRoutes, { prefix: "/api/v1/cloud" });

  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: "ok", message: "TrackCodex Backend API v1" };
  });

  // Auth
  fastify.post(
    "/auth/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        token: "dummy-token",
        user: { id: "1", name: "Test User", email: "test@example.com" },
      };
    },
  );

  fastify.get(
    "/auth/me",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        avatar: "https://github.com/github.png",
      };
    },
  );

  // Workspaces
  fastify.get("/workspaces", async (request: FastifyRequest) => {
    return [
      {
        id: "1",
        name: "My Workspace",
        status: "active",
        lastActive: new Date().toISOString(),
      },
    ];
  });

  fastify.post("/workspaces", async (request: FastifyRequest) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...(request.body as any),
      status: "creating",
    };
  });

  fastify.get("/workspaces/:id", async (request: FastifyRequest) => {
    const { id } = request.params as any;
    return { id, name: "My Workspace", status: "active", content: [] };
  });

  fastify.patch("/workspaces/:id/status", async (request: FastifyRequest) => {
    return { status: "updated" };
  });

  // Repositories
  fastify.get("/repositories", async (request: FastifyRequest) => {
    return [
      {
        id: "1",
        name: "trackcodex",
        description: "Main repo",
        stars: 10,
        language: "TypeScript",
      },
    ];
  });

  fastify.get("/repositories/:id", async (request: FastifyRequest) => {
    const { id } = request.params as any;
    return {
      id,
      name: "trackcodex",
      description: "Main repo",
      stars: 10,
      language: "TypeScript",
    };
  });

  fastify.post("/repositories", async (request: FastifyRequest) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...(request.body as any),
    };
  });

  // ForgeAI
  fastify.post("/forgeai/complete", async (request: FastifyRequest) => {
    return { content: "I am a simulated AI response from the local backend." };
  });

  fastify.get("/forgeai/analyze/:id", async (request: FastifyRequest) => {
    return { analysis: "This repository seems well structured." };
  });

  // Jobs
  fastify.get("/jobs", async (request: FastifyRequest) => {
    return [];
  });

  fastify.post("/jobs", async (request: FastifyRequest) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...(request.body as any),
    };
  });

  fastify.post("/jobs/:id/apply", async (request: FastifyRequest) => {
    return { success: true };
  });

  // Profiles
  fastify.get("/profiles/:username", async (request: FastifyRequest) => {
    const { username } = request.params as any;
    return { username, name: "Test User", bio: "Developer" };
  });

  fastify.patch("/profiles/me", async (request: FastifyRequest) => {
    return { success: true, ...(request.body as any) };
  });
}
