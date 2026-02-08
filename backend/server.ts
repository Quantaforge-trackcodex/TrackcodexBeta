// Fix: Import process from 'process' to ensure the Node.js process object is correctly typed
import process from "process";
import fs from "fs";
import { env } from "./config/env"; // Strict Env Validation

import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import socketio from "fastify-socket.io";
import websocket from "@fastify/websocket";
import path from "path";

import { routes } from "./routes/index";

// Removed unused imports and variables for clean startup

import { csrfProtection } from "./middleware/csrf";
import { RealtimeService } from "./services/realtime";
import { AppError } from "./utils/AppError";
import { PrismaClient } from "@prisma/client";

const server = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: true,
    },
  },
  // Trust proxy for correct IP detection behind load balancers/reverse proxies
  trustProxy: true,
});

const prisma = new PrismaClient();

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

// OTP Endpoint
server.post("/api/send-otp", async (request, reply) => {
  const { email, code } = request.body as { email: string; code: string };

  try {
    // MOCK EMAIL SENDING FOR DEV
    console.log("---------------------------------------------------");
    console.log(`[DEV MODE] OTP for ${email}: ${code}`);
    console.log("---------------------------------------------------");

    // Skip actual email sending
    /* 
    const data = await resend.emails.send({ ... }); 
    */
    const data = { id: "mock-id" };

    return { success: true, data };
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send({ success: false, error: "Failed to send email" });
  }
});

async function bootstrap() {
  // 1. Security Headers (Helmet) - First line of defense
  await server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust for React/Vite
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "http://localhost:3001",
          "ws://localhost:3001",
          "ws://localhost:4000",
          "http://localhost:4000",
        ],
      },
    },
    global: true,
  });

  // 2. Cookie Parser - Essential for HttpOnly sessions
  await server.register(cookie, {
    secret:
      process.env.COOKIE_SECRET ||
      "fallback-secret-change-in-prod-min-32-chars",
    parseOptions: {},
  });

  // 3. CORS - Strict configuration with credentials support
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        cb(null, true);
        return;
      }
      const allowedHosts = [
        process.env.FRONTEND_URL || "http://localhost:3001",
        "http://127.0.0.1:3001",
      ];
      if (
        allowedHosts.includes(origin) ||
        /http:\/\/localhost:\d+/.test(origin) ||
        /http:\/\/127\.0\.0\.1:\d+/.test(origin)
      ) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true, // Required for HttpOnly cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-user-id",
    ],
    maxAge: 86400, // cache preflight response for 24 hours
  });

  /* DISABLED FOR DEBUGGING 429 ISSUES
  // 4. Rate Limiting - DDoS protection
  await server.register(rateLimit, {
    max: 10000, // Extremely permissive for development
    timeWindow: "1 minute",
    keyGenerator: rateLimitKeyGenerator, // Custom key generator using IP + UserID
    errorResponseBuilder: (req, context) => {
      console.warn(
        `[GlobalRateLimit] BLOCKED: ip=${req.ip}, max=${context.max}`,
      );
      return {
        statusCode: 429,
        error: "Too Many Requests",
        message: "Global rate limit exceeded. REDUCED FOR DEV.",
        retryAfter: context.ttl,
      };
    },
  });
  */

  // 5. CSRF Protection - Global middleware
  // Run on preHandler to ensure cookies are parsed
  // server.addHook("preHandler", csrfProtection); // DISABLED FOR DEV SMOOTHNESS

  // 6. Socket.io Support
  await server.register(socketio, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 7. WebSocket Support (for Terminal PTY)
  await server.register(websocket);

  // Initialize RealtimeService with the IO instance
  RealtimeService.init((server as any).io);

  // 8. GraphQL API (Mercurius)
  try {
    const { typeDefs: schema } = await import("./graphql/schema");
    const { resolvers } = await import("./graphql/resolvers");
    const mercuriusModule = await import("mercurius");
    const mercurius = mercuriusModule.default || mercuriusModule;
    await server.register(mercurius, {
      schema,
      resolvers,
      graphiql: process.env.NODE_ENV !== "production",
      path: "/graphql",
      context: (request: any) => {
        return { user: request.user };
      },
    });
  } catch (err) {
    console.warn("[WARN] Mercurius (GraphQL) failed to load, skipping:", (err as Error).message);
  }

  // 9. CI/CD API (Native)
  try {
    const ciModule = await import("./routes/ci");
    await server.register(ciModule.default || ciModule, { prefix: "/api/ci" });
  } catch (err) {
    console.warn("[WARN] CI routes failed to load:", (err as Error).message);
  }

  // 10. Native Git Smart HTTP
  const gitContentTypes = [
    "application/x-git-upload-pack-request",
    "application/x-git-receive-pack-request",
  ];
  gitContentTypes.forEach((contentType) => {
    server.addContentTypeParser(
      contentType,
      { parseAs: "buffer" },
      (req, body, done) => {
        done(null, body);
      },
    );
  });

  // Register Git Routes
  try {
    const gitModule = await import("./routes/git");
    await server.register(gitModule.default || gitModule, { prefix: "/git" });
  } catch (err) {
    console.warn("[WARN] Git routes failed to load:", (err as Error).message);
  }

  // NOTE: Profile, Portfolio, and Stats routes are already registered in routes/index.ts
  // Do not register them here to avoid FST_ERR_DUPLICATED_ROUTE


  // 11. Multipart Support (for Artifacts)
  try {
    const multipartModule = await import("@fastify/multipart");
    const multipart = multipartModule.default || multipartModule;
    await server.register(multipart, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    });

    // Artifact Upload routes (depends on multipart)
    const artifactsModule = await import("./routes/artifacts");
    await server.register(artifactsModule.default || artifactsModule, { prefix: "/api/artifacts" });
  } catch (err) {
    console.warn("[WARN] Multipart/Artifacts failed to load:", (err as Error).message);
  }

  // Root Health Check - ONLY IN DEV
  // In production, fastify-static handles "/" via index.html
  if (process.env.NODE_ENV !== "production") {
    server.get("/", async (request, reply) => {
      // If browser request, redirect to frontend
      if (request.headers["accept"]?.includes("text/html")) {
        return reply.redirect("http://localhost:3001");
      }
      return {
        status: "online",
        message: "TrackCodex Backend Server is running.",
        api_version: "v1",
        security: "enhanced",
      };
    });
  }

  // Register API Routes
  await server.register(routes, { prefix: "/api/v1" });

  // Serve Frontend in Production
  if (process.env.NODE_ENV === "production") {
    const path = await import("path");
    const fastifyStatic = (await import("@fastify/static")).default;

    // Serve static files from 'dist'
    // In prod: dist-backend/index.js is execution point so ../dist is sibling
    await server.register(fastifyStatic, {
      root: path.join(__dirname, "../dist"),
      prefix: "/",
      wildcard: false, // Handle 404s manually for SPA
    });

    // SPA Fallback for non-API routes
    server.setNotFoundHandler((request, reply) => {
      if (request.raw.url && request.raw.url.startsWith("/api")) {
        reply.status(404).send({
          status: "404_NOT_FOUND",
          message: `Route ${request.method}:${request.url} is not registered on the TrackCodex Backend.`,
          available_endpoints: ["/", "/api/v1", "/api/v1/jobs"],
        });
      } else {
        // Serve index.html for client-side routing
        reply.sendFile("index.html");
      }
    });
  } else {
    // Dev mode or default 404
    server.setNotFoundHandler((request, reply) => {
      server.log.warn(`404 Encountered: ${request.method} ${request.url}`);
      reply.status(404).send({
        status: "404_NOT_FOUND",
        message: `Route ${request.method}:${request.url} is not registered on the TrackCodex Backend.`,
        available_endpoints: ["/", "/api/v1", "/api/v1/jobs"],
      });
    });
  }

  // Global Error Handler
  // Global Error Handler
  // Global Error Handler
  server.setErrorHandler((error, request, reply) => {
    const isDev = process.env.NODE_ENV !== "production";

    // Log to file for persistence
    try {
      const errAny = error as any;
      const errorLog = `\n[${new Date().toISOString()}] ERROR: ${errAny.message}\n${errAny.stack || ""}\n`;
      fs.appendFileSync("./backend_crash.log", errorLog);
    } catch (err) {
      /* ignore */
    }

    // 1. Check if it's a trusted AppError
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        success: false,
        status: "error",
        code: error.code || "ERROR",
        message: error.message,
      });
    }

    // 2. Prisma Errors
    if ((error as any).code === "P2002") {
      return reply.code(409).send({
        success: false,
        code: "DUPLICATE_ENTRY",
        message: "Unique constraint failed. This record already exists.",
      });
    }

    // 3. Handle authentication/authorization errors (CRITICAL FIX for login 500)
    const errorMsg = (error as any).message?.toLowerCase() || "";
    const statusCode = (error as any).statusCode;

    // Unauthorized (401)
    if (
      statusCode === 401 ||
      errorMsg.includes("unauthorized") ||
      errorMsg.includes("invalid credentials") ||
      errorMsg.includes("authentication failed")
    ) {
      return reply.code(401).send({
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    // Forbidden (403)
    if (
      statusCode === 403 ||
      errorMsg.includes("forbidden") ||
      errorMsg.includes("access denied") ||
      errorMsg.includes("account locked")
    ) {
      return reply.code(403).send({
        success: false,
        code: "FORBIDDEN",
        message: isDev ? (error as any).message : "Access forbidden",
      });
    }

    // Bad Request (400) - Validation errors
    if (
      statusCode === 400 ||
      (error as any).validation ||
      (error as any).name === "ValidationError" ||
      errorMsg.includes("required") ||
      errorMsg.includes("invalid")
    ) {
      return reply.code(400).send({
        success: false,
        code: "BAD_REQUEST",
        message: isDev ? (error as any).message : "Invalid request data",
      });
    }

    // Not Found (404)
    if ((error as any).code === "P2025" || statusCode === 404) {
      return reply.code(404).send({
        success: false,
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }

    // 4. Catch-all for genuine server errors (500)
    server.log.error(error);
    console.error("DEBUG: UNHANDLED ERROR CAUGHT:", error);

    // Force write to absolute path for debugging
    try {
      const errAny = error as any;
      // fs and path are imported at the top
      const logPath = path.resolve("backend_crash_forced.log");
      const errorLog = `\n[${new Date().toISOString()}] ERROR: ${errAny.message}\n${errAny.stack || ""}\n`;
      fs.appendFileSync(logPath, errorLog);
    } catch (e) {
      console.error("Log write failed", e);
    }

    reply.status(500).send({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: (error as any).message || "Unknown Internal Error",
      stack: (error as any).stack,
      original_error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  });

  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database");

    const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await server.listen({ port, host: "0.0.0.0" });
    console.log(
      `🚀 TrackCodex Backend operational on port ${port} (Secure Mode)`,
    );
    if (process.env.NODE_ENV !== "production") {
      console.log("---------------------------------------");
      console.log("🔑 Developer Credentials:");
      console.log("   Email: dev@trackcodex.dev");
      console.log("   Pass : password123");
      console.log("---------------------------------------");
    }
  } catch (err) {
    server.log.error(err);
    await prisma.$disconnect();
  }
}

bootstrap();
