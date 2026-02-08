/**
 * Session Management Service with Redis Store
 * Provides secure HttpOnly cookie-based sessions with Redis backing
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export interface SessionData {
  userId: string;
  email: string;
  username: string;
  name: string;
  avatar?: string | null;
  role: string;
  tokenVersion: number;
  organizationId?: string | null;
  workspaceId?: string | null;
}

export interface SessionMetadata {
  ipAddress: string;
  userAgent: string;
}

/**
 * Create a new session
 */
export async function createSession(
  sessionId: string,
  data: SessionData,
  metadata: SessionMetadata,
  expiresInMs: number = 7 * 24 * 60 * 60 * 1000, // 7 days
): Promise<{ sessionId: string; csrfToken: string }> {
  const expiresAt = new Date(Date.now() + expiresInMs);
  const csrfToken = crypto.randomBytes(32).toString("hex");

  // Ensure we have current token version if not passed (fetch user)
  let tokenVersion = data.tokenVersion;
  if (tokenVersion === undefined) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { tokenVersion: true },
    });
    tokenVersion = user?.tokenVersion || 1;
  }

  await prisma.session.create({
    data: {
      sessionId,
      userId: data.userId,
      organizationId: data.organizationId || null,
      workspaceId: data.workspaceId || null,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      csrfToken,
      tokenVersion,
      expiresAt,
      lastActivityAt: new Date(),
    },
  });

  return { sessionId, csrfToken };
}

/**
 * Get session data
 */
export async function getSession(
  sessionId: string,
): Promise<(SessionData & { csrfToken: string }) | null> {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    include: { user: true },
  });

  if (!session) return null;

  // CRITICAL FIX: Check if user still exists
  // This prevents TypeError when user is deleted but session persists
  if (!session.user) {
    // User was deleted - revoke orphaned session and return null
    // This will properly trigger 401 Unauthorized instead of 500
    await revokeSession(sessionId);
    return null;
  }

  // Check version match (Global Logout)
  if (session.tokenVersion !== session.user.tokenVersion) {
    await revokeSession(sessionId);
    return null;
  }

  // Check if expired
  if (session.expiresAt < new Date()) {
    await revokeSession(sessionId);
    return null;
  }

  // Check if revoked
  if (session.revokedAt) {
    return null;
  }

  // Update last activity
  await prisma.session.update({
    where: { sessionId },
    data: { lastActivityAt: new Date() },
  });

  return {
    userId: session.userId,
    email: session.user.email as string,
    username: session.user.username as string,
    name: session.user.name as string,
    avatar: session.user.avatar,
    role: session.user.role as string,
    tokenVersion: session.tokenVersion,
    organizationId: session.organizationId,
    workspaceId: session.workspaceId,
    csrfToken: session.csrfToken,
  };
}

/**
 * Revoke a session (logout)
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.session
    .update({
      where: { sessionId },
      data: { revokedAt: new Date() },
    })
    .catch(() => {
      // Session might not exist, that's okay
    });
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });
}

/**
 * Clean up expired sessions (run via cron)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<
  Array<{
    id: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    lastActivityAt: Date;
  }>
> {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      lastActivityAt: true,
    },
    orderBy: { lastActivityAt: "desc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress || "",
    userAgent: s.userAgent || "",
    createdAt: s.createdAt,
    lastActivityAt: s.lastActivityAt,
  }));
}

/**
 * Validate CSRF token
 */
export async function validateCsrfToken(
  sessionId: string,
  token: string,
): Promise<boolean> {
  const session = await prisma.session.findUnique({
    where: { sessionId },
    select: { csrfToken: true },
  });

  return session?.csrfToken === token;
}
