import { FastifyRequest, FastifyReply } from "fastify";
import { getSession } from "../services/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Authentication middleware - reads session from HttpOnly cookie
 * Verifies session and attaches user info to request
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // Get session ID from HttpOnly cookie
    const sessionId = request.cookies?.session_id;

    if (!sessionId) {
      console.warn(
        "[Auth Middleware] 401: No session_id cookie found in request.",
      );
      console.warn("[Auth Middleware] Cookies received:", request.cookies);
      return reply.code(401).send({
        error: "Unauthorized",
        message: "No session cookie found",
      });
    }

    // Get and validate session
    const sessionData = await getSession(sessionId);

    if (!sessionData) {
      console.warn(
        `[Auth Middleware] 401: Session ID ${sessionId} not found in store.`,
      );
      // Clear invalid cookie
      reply.clearCookie("session_id");
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Session expired or invalid",
      });
    }

    // Attach user info to request
    (request as any).user = {
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role,
      organizationId: sessionData.organizationId,
      workspaceId: sessionData.workspaceId,
    };

    // Attach CSRF token for response
    (request as any).csrfToken = sessionData.csrfToken;
  } catch (error: any) {
    return reply.code(401).send({
      error: "Unauthorized",
      message: error.message || "Authentication failed",
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if session exists, but doesn't reject if missing
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const sessionId = request.cookies?.session_id;

    if (sessionId) {
      const sessionData = await getSession(sessionId);

      if (sessionData) {
        (request as any).user = {
          userId: sessionData.userId,
          email: sessionData.email,
          role: sessionData.role,
          organizationId: sessionData.organizationId,
          workspaceId: sessionData.workspaceId,
        };
        (request as any).csrfToken = sessionData.csrfToken;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }
}

/**
 * Role-based authorization middleware
 * Requires authentication and checks user role
 */
export function requireRole(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // First ensure user is authenticated
    await requireAuth(request, reply);

    const user = (request as any).user;
    if (!user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.role)) {
      return reply.code(403).send({
        error: "Forbidden",
        message: `Insufficient permissions. Required role: ${allowedRoles.join(" or ")}`,
      });
    }
  };
}

/**
 * Permission-based authorization middleware
 * Checks fine-grained permissions on specific resources
 */
export function requirePermission(
  resource: string,
  action: string,
  getResourceId?: (request: FastifyRequest) => string,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // First ensure user is authenticated
    await requireAuth(request, reply);

    const user = (request as any).user;
    if (!user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Super admins bypass permission checks
    if (user.role === "super_admin") {
      return;
    }

    // Get resource ID if function provided
    const resourceId = getResourceId ? getResourceId(request) : null;

    // Check permission
    const hasPermission = await prisma.permission.findFirst({
      where: {
        userId: user.userId,
        resource,
        action,
        ...(resourceId ? { resourceId } : {}),
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });

    if (!hasPermission) {
      return reply.code(403).send({
        error: "Forbidden",
        message: `You don't have permission to ${action} this ${resource}`,
      });
    }
  };
}

/**
 * Ownership check middleware
 * Verifies user owns the resource they're trying to access
 */
export function requireOwnership(
  resourceType: string,
  getResourceId: (request: FastifyRequest) => string,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // First ensure user is authenticated
    await requireAuth(request, reply);

    const user = (request as any).user;
    if (!user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    // Super admins bypass ownership checks
    if (user.role === "super_admin") {
      return;
    }

    const resourceId = getResourceId(request);

    // Check ownership based on resource type
    let isOwner = false;

    switch (resourceType) {
      case "workspace": {
        const workspace = await prisma.workspace.findUnique({
          where: { id: resourceId },
          select: { ownerId: true },
        });
        isOwner = workspace?.ownerId === user.userId;
        break;
      }

      case "job": {
        const job = await prisma.job.findUnique({
          where: { id: resourceId },
          select: { creatorId: true },
        });
        isOwner = job?.creatorId === user.userId;
        break;
      }

      // Add more resource types as needed

      default:
        return reply.code(400).send({
          error: "Invalid Resource Type",
          message: `Unknown resource type: ${resourceType}`,
        });
    }

    if (!isOwner) {
      return reply.code(403).send({
        error: "Forbidden",
        message: "You do not own this resource",
      });
    }
  };
}

/**
 * Require email verification
 */
export async function requireVerifiedEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await requireAuth(request, reply);

  const user = (request as any).user;
  if (!user) return;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { emailVerified: true },
  });

  if (!dbUser?.emailVerified) {
    return reply.code(403).send({
      error: "Email Not Verified",
      message: "Please verify your email address to access this resource",
    });
  }
}

/**
 * Require completed profile
 */
export async function requireCompleteProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await requireAuth(request, reply);

  const user = (request as any).user;
  if (!user) return;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { profileCompleted: true },
  });

  if (!dbUser?.profileCompleted) {
    return reply.code(403).send({
      error: "Profile Incomplete",
      message: "Please complete your profile to access this resource",
      redirectTo: "/onboarding/profile",
    });
  }
}
