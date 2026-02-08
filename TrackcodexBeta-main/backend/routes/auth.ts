import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import { OAuthService } from "../services/oauth";
import { encrypt } from "../services/encryption";
import { requireAuth } from "../middleware/auth";
import {
  createSession,
  getSession,
  revokeSession,
  revokeAllUserSessions,
} from "../services/session";
import {
  logLoginAttempt,
  checkSuspiciousActivity,
  logSensitiveOperation,
  logOAuthLink,
} from "../services/auditLogger";
import { rateLimitConfig } from "../middleware/rateLimit";
import {
  AppError,
  BadRequest,
  Unauthorized,
  Conflict,
  InternalError,
  NotFound,
  Forbidden,
} from "../utils/AppError";

const prisma = new PrismaClient();

export async function authRoutes(fastify: FastifyInstance) {
  // Health Check
  fastify.get("/auth/health", async () => ({ status: "ok" }));

  // Register with email/password
  fastify.post(
    "/auth/register",
    {
      config: { rateLimit: rateLimitConfig.register },
    },
    async (request, reply) => {
      const { email, password, name, username } = request.body as any;

      try {
        // 1. Strict Input Validation
        if (!email || !password || !name || !username) {
          throw BadRequest("Missing required fields");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw BadRequest("Invalid email format");
        }

        if (password.length < 8) {
          throw BadRequest("Password must be at least 8 characters");
        }

        // 2. Check for existing user (Atomic check not possible without constraints, catching constraint violation below)
        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
          if (existingUser.email === email) {
            throw Conflict("Email already in use");
          }
          throw Conflict("Username already taken");
        }

        // 3. Create User
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email,
            username,
            name,
            password: hashedPassword,
            role: "user",
            profileCompleted: true,
          },
        });

        // 4. Create Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            username: user.username as string,
            name: user.name as string,
            role: user.role,
            tokenVersion: user.tokenVersion,
          },
          {
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"] || "unknown",
          },
        );

        // 5. Set Cookie
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        // 6. Audit Log
        await logLoginAttempt(
          email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.id,
        );

        return {
          message: "Registration successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error: any) {
        request.log.error(error);
        if (error instanceof Error) {
          try {
            fs.writeFileSync(
              "backend_register_error.log",
              error.name + ": " + error.message + "\n" + error.stack,
            );
          } catch (e) {
            console.error("Failed to write log", e);
          }
        }

        // Handle Prisma Unique Constraint Violation
        if (error.code === "P2002") {
          throw Conflict("User already exists (Email or Username taken)");
        }
        throw error; // Let global handler manage it
      }
    },
  );

  // DEV ONLY: Bypass Login
  if (process.env.NODE_ENV !== "production") {
    fastify.post("/auth/dev-login", async (request, reply) => {
      try {
        // Atomic "Find or Create" logic using transaction not strictly needed here if we handle races,
        // but for dev login, simple is fine. We just want reliability.
        let user = await prisma.user.findFirst();

        if (!user) {
          try {
            const bcrypt = await import("bcryptjs");
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await prisma.user.create({
              data: {
                email: "dev@trackcodex.dev",
                username: "devuser",
                name: "Developer",
                password: hashedPassword,
                role: "user",
                profileCompleted: true,
              },
            });
          } catch (createError) {
            // Race condition: User created by another request moments ago
            user = await prisma.user.findFirst();
            if (!user) throw createError; // Genuine failure
          }
        }

        if (!user) throw new Error("Failed to find or create dev user");

        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            username: user.username as string,
            name: user.name as string,
            role: user.role,
            tokenVersion: user.tokenVersion,
          },
          {
            ipAddress: request.ip,
            userAgent: request.headers["user-agent"] || "unknown",
          },
        );

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          message: "Dev login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Dev login failed" });
      }
    });
  }

  // Get Current User (Session Check)
  fastify.get("/auth/me", async (request, reply) => {
    try {
      console.log("DEBUG: /me called");
      const sessionId = request.cookies.session_id;
      console.log("DEBUG: Session ID from cookie:", sessionId);

      if (!sessionId) {
        console.log("DEBUG: No session ID");
        return reply.code(401).send({ error: "Unauthorized" });
      }

      console.log("DEBUG: Calling getSession");
      const session = await getSession(sessionId);
      console.log("DEBUG: getSession result:", session ? "Found" : "Null");

      if (!session) {
        return reply.code(401).send({ error: "Unauthorized" });
      }

      // Check for locked account
      console.log("DEBUG: Checking user lock status");
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { accountLocked: true },
      });

      if (user?.accountLocked) {
        console.log("DEBUG: Account is locked");
        return reply.code(403).send({ error: "Account Locked" });
      }

      console.log("DEBUG: Returning user data");
      return {
        user: {
          id: session.userId,
          email: session.email,
          username: session.username,
          name: session.name,
          avatar: session.avatar,
          role: session.role,
          organizationId: session.organizationId,
          workspaceId: session.workspaceId,
        },
        csrfToken: session.csrfToken,
      };
    } catch (error) {
      console.error("DEBUG: /me CRASH:", error);
      request.log.error(error);
      // Fallback: Clear cookie if invalid
      if (request.cookies.session_id) {
        reply.clearCookie("session_id", { path: "/" });
      }
      return reply.code(401).send({ error: "Session invalid" }); // Return 401 instead of 500 to stop retry loop
    }
  });

  // Login with email/password
  fastify.post(
    "/auth/login",
    {
      config: { rateLimit: rateLimitConfig.login },
    },
    async (request, reply) => {
      const { email, password, username } = request.body as any;
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        // Accept either email or username
        const identifier = email || username;

        // 1. Check Suspicious Activity
        if (process.env.NODE_ENV === "production") {
          const securityCheck = await checkSuspiciousActivity(identifier, ip);
          if (securityCheck.shouldLock) {
            await logSensitiveOperation(
              "system",
              "block_login",
              "auth",
              identifier,
              ip,
              userAgent,
              true,
              { reason: securityCheck.reason },
            );
            throw Forbidden(
              "Account Locked: " +
                (securityCheck.reason || "Too many failed attempts"),
            );
          }
        }

        if (!identifier || !password) {
          throw BadRequest("Email/Username and password required");
        }

        // Find user by email OR username
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { username: identifier }],
          },
        });

        // 2. Validate Credentials
        // Timing attack mitigation: always hash comparison even if user not found?
        // For now, simpler logic is acceptable as long as we return generic error.
        if (!user || !user.password) {
          await logLoginAttempt(
            identifier,
            ip,
            userAgent,
            false,
            undefined,
            "invalid_credentials",
          );
          return reply.code(401).send({ error: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          await logLoginAttempt(
            identifier,
            ip,
            userAgent,
            false,
            user.id,
            "invalid_password",
          );
          return reply.code(401).send({ error: "Invalid credentials" });
        }

        // 3. Create Secure Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            username: user.username as string,
            name: user.name as string,
            role: user.role,
            tokenVersion: user.tokenVersion,
          },
          {
            ipAddress: ip,
            userAgent,
          },
        );

        // 4. Set HttpOnly Cookie
        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // 5. Audit Log
        await logLoginAttempt(identifier, ip, userAgent, true, user.id);

        return {
          message: "Login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } catch (error: any) {
        request.log.error(error);
        if (error instanceof AppError) throw error;
        throw error; // Global handler will catch this
      }
    },
  );

  // Google OAuth callback
  fastify.post(
    "/auth/google",
    {
      config: { rateLimit: rateLimitConfig.oauth },
    },
    async (request, reply) => {
      const { code, codeVerifier } = request.body as {
        code: string;
        codeVerifier?: string;
      };
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        if (!code) {
          throw BadRequest("Authorization code required");
        }

        // Exchange code for tokens (using new Service)
        const tokenData = await OAuthService.exchangeGoogleCode(
          code,
          codeVerifier,
        );

        // Get user info from Google
        const googleUser = await OAuthService.getGoogleUserInfo(
          tokenData.access_token,
        );

        // Find or create user logic
        let user = await prisma.user.findFirst({
          where: { email: googleUser.email },
        });

        // Encrypt tokens before storage
        const encryptedAccessToken = encrypt(tokenData.access_token);
        const encryptedRefreshToken = tokenData.refresh_token
          ? encrypt(tokenData.refresh_token)
          : undefined;
        const encryptedIdToken = tokenData.id_token
          ? encrypt(tokenData.id_token)
          : undefined;

        if (user) {
          // Link Verification
          const existingLink = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleUser.id,
              },
            },
          });

          if (!existingLink) {
            // Create link
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "google",
                providerAccountId: googleUser.id,
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                tokenType: tokenData.token_type,
                idToken: encryptedIdToken,
              },
            });
            await logOAuthLink(user.id, "google", "link", ip, userAgent);
          } else {
            // Update tokens
            await prisma.oAuthAccount.update({
              where: { id: existingLink.id },
              data: {
                accessToken: encryptedAccessToken,
                refreshToken:
                  encryptedRefreshToken || existingLink.refreshToken,
                idToken: encryptedIdToken,
              },
            });
          }
        } else {
          // Register new user
          // Ensure username uniqueness
          let username = googleUser.email.split("@")[0];
          const exists = await prisma.user.findUnique({ where: { username } });
          if (exists) {
            username = username + "_" + Math.random().toString(36).substring(7);
          }

          user = await prisma.user.create({
            data: {
              email: googleUser.email,
              username,
              name: googleUser.name,
              avatar: googleUser.avatar,
              role: "user",
              emailVerified: true, // Google verified
              emailVerifiedAt: new Date(),
              oauthAccounts: {
                create: {
                  provider: "google",
                  providerAccountId: googleUser.id,
                  accessToken: encryptedAccessToken,
                  refreshToken: encryptedRefreshToken,
                  tokenType: tokenData.token_type,
                  idToken: encryptedIdToken,
                },
              },
            },
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "google",
            ip,
            userAgent,
            true,
          );
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            username: user.username as string,
            name: user.name as string,
            role: user.role,
            tokenVersion: user.tokenVersion,
          },
          { ipAddress: ip, userAgent },
        );

        // Log Login
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "AUTH_LOGIN",
            details: { provider: "google", method: "oauth", ip, userAgent },
          },
        });

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          message: "OAuth login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
          },
        };
      } catch (error: any) {
        if (error instanceof AppError) throw error;
        request.log.error(error);
        throw InternalError("Google login failed");
      }
    },
  );

  // GitHub OAuth callback
  fastify.post(
    "/auth/github",
    {
      config: { rateLimit: rateLimitConfig.oauth },
    },
    async (request, reply) => {
      const { code } = request.body as { code: string };
      const ip = request.ip;
      const userAgent = request.headers["user-agent"] || "unknown";

      try {
        if (!code) throw BadRequest("Authorization code required");

        const tokenData = await OAuthService.exchangeGithubCode(code);
        const githubUser = await OAuthService.getGithubUserInfo(
          tokenData.access_token,
        );

        const email = githubUser.email;

        if (!email)
          throw BadRequest("No verified email found in GitHub account");

        // Encrypt tokens
        const encryptedAccessToken = encrypt(tokenData.access_token);
        // GitHub doesn't usually give refresh tokens in web flow unless app is GitHub App
        const encryptedRefreshToken = tokenData.refresh_token
          ? encrypt(tokenData.refresh_token)
          : undefined;

        // Find existing user by email
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          // Link account
          const existingLink = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "github",
                providerAccountId: githubUser.id,
              },
            },
          });

          if (!existingLink) {
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: "github",
                providerAccountId: githubUser.id,
                accessToken: encryptedAccessToken,
                scope: tokenData.scope,
              },
            });
            await logOAuthLink(user.id, "github", "link", ip, userAgent);
          } else {
            // Update token
            await prisma.oAuthAccount.update({
              where: { id: existingLink.id },
              data: { accessToken: encryptedAccessToken },
            });
          }

          // [SYNC] Ensure Username matches GitHub (only if not taken)
          if (user.username !== githubUser.username) {
            // Logic to sync username skipped to prevent confusing changes for existing users
            // If vital, can be added back, but strictly it's safer not to force rename.
          }
        } else {
          // Register
          let username = githubUser.username;
          // Ensure uniqueness
          const exists = await prisma.user.findUnique({ where: { username } });
          if (exists) {
            username = username + "_" + Math.random().toString(36).substring(7);
          }

          user = await prisma.user.create({
            data: {
              email,
              username,
              name: githubUser.name || username,
              avatar: githubUser.avatar,
              role: "user",
              emailVerified: true,
              emailVerifiedAt: new Date(),
              oauthAccounts: {
                create: {
                  provider: "github",
                  providerAccountId: githubUser.id,
                  accessToken: encryptedAccessToken,
                  scope: tokenData.scope,
                },
              },
            },
          });
          await logSensitiveOperation(
            user.id,
            "register_oauth",
            "auth",
            "github",
            ip,
            userAgent,
            true,
          );
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        const { csrfToken } = await createSession(
          sessionId,
          {
            userId: user.id,
            email: user.email,
            role: user.role,
            username: user.username as string,
            name: user.name as string,
            tokenVersion: user.tokenVersion,
          },
          { ipAddress: ip, userAgent },
        );

        // Log Login
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "AUTH_LOGIN",
            details: { provider: "github", method: "oauth", ip, userAgent },
          },
        });

        reply.setCookie("session_id", sessionId, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          message: "OAuth login successful",
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
          },
        };
      } catch (error: any) {
        if (error instanceof AppError) throw error;
        request.log.error(error);
        throw InternalError("GitHub login failed");
      }
    },
  );

  // Logout
  fastify.post(
    "/auth/logout",
    { preHandler: requireAuth },
    async (request, reply) => {
      const sessionId = request.cookies.session_id;
      if (sessionId) {
        await revokeSession(sessionId);
        reply.clearCookie("session_id", { path: "/" });

        // Log logout
        const user = (request as any).user;
        await logLoginAttempt(
          user.email,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
          user.userId,
          "logout",
        );
      }
      return { message: "Logged out successfully" };
    },
  );

  // Global Logout (Invalidate ALL sessions)
  fastify.post(
    "/auth/logout-everywhere",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;

      try {
        // Increment token version to invalidate all past sessions
        await prisma.user.update({
          where: { id: user.userId },
          data: { tokenVersion: { increment: 1 } },
        });

        // Also revoke physical session records for good measure
        await revokeAllUserSessions(user.userId);

        reply.clearCookie("session_id", { path: "/" });
        return { message: "Logged out from all devices successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Email Verification ---
  fastify.post(
    "/auth/verify-email/request",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      // In a real app, you'd rate limit this aggressively

      try {
        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store token
        await prisma.verificationToken.create({
          data: {
            identifier: user.email,
            token,
            expires,
          },
        });

        // Mock Email Sending (Log to console)
        request.log.info(
          `[EMAIL MOCK] To: ${user.email} | Subject: Verify Email | Link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
        );

        return { message: "Verification email sent" };
      } catch (error) {
        request.log.error(error);
        return reply
          .code(500)
          .send({ error: "Failed to send verification email" });
      }
    },
  );

  fastify.post("/auth/verify-email/confirm", async (request, reply) => {
    const { token } = request.body as { token: string };

    if (!token) return reply.code(400).send({ error: "Token required" });

    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        return reply.code(400).send({ error: "Invalid token" });
      }

      if (verificationToken.expires < new Date()) {
        return reply.code(400).send({ error: "Token expired" });
      }

      // Verify User
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });
      if (!user) return reply.code(400).send({ error: "User not found" });

      // Update User
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      // Delete token
      await prisma.verificationToken.delete({ where: { token } });

      return { message: "Email verified successfully" };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Verification failed" });
    }
  });

  // --- Profile Completion ---
  fastify.post(
    "/auth/profile/complete",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { username, name, bio, role } = request.body as any;
      const user = (request as any).user;

      try {
        const updatedUser = await prisma.user.update({
          where: { id: user.userId },
          data: {
            username,
            name,
            profileCompleted: true,
            // In a real app, storing bio/role would likely be in a Profile relation
            // For now updating core user if fields exist or ignoring
          },
        });
        return { message: "Profile updated", user: updatedUser };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Failed to update profile" });
      }
    },
  );

  // --- Session Management ---

  // Get active sessions
  fastify.get(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      const currentSessionId = request.cookies.session_id;

      try {
        const sessions = await prisma.session.findMany({
          where: {
            userId: user.userId,
            revokedAt: null,
            expiresAt: { gte: new Date() },
          },
          orderBy: { lastActivityAt: "desc" },
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            lastActivityAt: true,
            sessionId: true, // Need this to identify current session
          },
        });

        // Map to hide internal IDs and flag current session
        return sessions.map((s) => ({
          id: s.sessionId, // Use public session ID
          ipAddress: s.ipAddress,
          userAgent: s.userAgent,
          lastActivityAt: s.lastActivityAt,
          isCurrent: s.sessionId === currentSessionId,
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Revoke specific session
  fastify.delete(
    "/auth/sessions/:sessionId",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { sessionId } = request.params as { sessionId: string };
      const user = (request as any).user;

      try {
        // Verify ownership
        const session = await prisma.session.findUnique({
          where: { sessionId },
        });

        if (!session || session.userId !== user.userId) {
          return reply.code(404).send({ error: "Session not found" });
        }

        await revokeSession(sessionId);
        return { message: "Session revoked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // Revoke all other sessions
  fastify.delete(
    "/auth/sessions",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      const currentSessionId = request.cookies.session_id;

      try {
        await prisma.session.updateMany({
          where: {
            userId: user.userId,
            sessionId: { not: currentSessionId }, // Keep current
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        });
        return { message: "All other sessions revoked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Audit Logs ---
  fastify.get(
    "/auth/audit-logs",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      try {
        // Fetch login attempts (since that's what the UI expects for now)
        // Ideally we'd merge ActivityLog and LoginAttempt or use just ActivityLog
        const logs = await prisma.loginAttempt.findMany({
          where: {
            userId: user.userId,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        });

        return logs.map((l) => ({
          id: l.id,
          action: l.success ? "login_success" : "login_failed",
          ipAddress: l.ipAddress,
          userAgent: l.userAgent,
          success: l.success,
          createdAt: l.createdAt,
          details: { reason: l.failureReason },
        }));
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Linked Accounts ---
  fastify.get(
    "/auth/connections",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = (request as any).user;
      try {
        const accounts = await prisma.oAuthAccount.findMany({
          where: { userId: user.userId },
          select: { provider: true },
        });

        return {
          google: accounts.some((a) => a.provider === "google"),
          github: accounts.some((a) => a.provider === "github"),
        };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  fastify.delete(
    "/auth/connections/:provider",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { provider } = request.params as { provider: string };
      const user = (request as any).user;

      try {
        // Prevent unlinking if it's the only method (simplified check)
        // Ideally check if password exists or other providers exist
        const connectionCount = await prisma.oAuthAccount.count({
          where: { userId: user.userId },
        });

        const dbUser = await prisma.user.findUnique({
          where: { id: user.userId },
          select: { password: true },
        });

        if (connectionCount <= 1 && !dbUser?.password) {
          return reply
            .code(400)
            .send({ error: "Cannot unlink last sign-in method" });
        }

        await prisma.oAuthAccount.deleteMany({
          where: {
            userId: user.userId,
            provider,
          },
        });

        return { message: "Account unlinked" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  // --- Account Deletion ---
  fastify.delete(
    "/auth/account",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { password, confirmation } = request.body as any;
      const user = (request as any).user;

      if (confirmation !== "DELETE") {
        return reply.code(400).send({ error: "Invalid confirmation code" });
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.userId },
        });

        if (!dbUser) {
          return reply.code(404).send({ error: "User not found" });
        }

        // Verify password if user has one
        if (dbUser.password) {
          if (!password) {
            return reply.code(400).send({ error: "Password required" });
          }
          const isValid = await bcrypt.compare(password, dbUser.password);
          if (!isValid) {
            return reply.code(401).send({ error: "Invalid password" });
          }
        }

        // Soft delete user
        await prisma.user.update({
          where: { id: user.userId },
          data: {
            deletedAt: new Date(),
            deleteScheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            email: `deleted_${Date.now()}_${dbUser.email}`, // Free up email immediately
            username: `deleted_${Date.now()}_${dbUser.username}`,
          },
        });

        // Revoke all sessions
        const currentSessionId = request.cookies.session_id;
        if (currentSessionId) {
          await revokeSession(currentSessionId); // Current
        }
        await prisma.session.updateMany({
          where: { userId: user.userId },
          data: { revokedAt: new Date() },
        });

        // Log it
        await logSensitiveOperation(
          user.userId,
          "delete_account",
          "user",
          user.userId,
          request.ip,
          request.headers["user-agent"] || "unknown",
          true,
        );

        reply.clearCookie("session_id", { path: "/" });
        return { message: "Account deleted successfully" };
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
}
