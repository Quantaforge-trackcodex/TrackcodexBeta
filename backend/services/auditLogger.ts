/**
 * Audit Logging Service
 * Logs all security-critical events for monitoring and compliance
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuditEventData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  workspaceId?: string;
  repoId?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata?: Record<string, any>;
  failureReason?: string;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(event: AuditEventData): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: event.userId || null,
        action: event.action,
        workspaceId: event.workspaceId || event.metadata?.workspaceId || null,
        repoId: event.repoId || event.metadata?.repoId || null,
        details: {
          resource: event.resource,
          resourceId: event.resourceId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          success: event.success,
          failureReason: event.failureReason,
          ...event.metadata,
        },
      },
    });
  } catch (error) {
    // Don't let audit logging failures break the app
    console.error("Failed to log audit event:", error);
  }
}

/**
 * Log login attempt
 */
export async function logLoginAttempt(
  email: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  userId?: string,
  failureReason?: string,
): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: {
        userId,
        email,
        ipAddress,
        userAgent,
        success,
        failureReason,
      },
    });

    // Also log as audit event
    await logAuditEvent({
      userId,
      action: success ? "login_success" : "login_failure",
      resource: "auth",
      ipAddress,
      userAgent,
      success,
      failureReason,
      metadata: { email },
    });
  } catch (error) {
    console.error("Failed to log login attempt:", error);
  }
}

/**
 * Check for suspicious login activity
 * Returns true if account should be locked
 */
export async function checkSuspiciousActivity(
  email: string,
  ipAddress: string,
): Promise<{
  shouldLock: boolean;
  reason?: string;
  failedAttempts?: number;
}> {
  // Check failed attempts in last 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const recentFailures = await prisma.loginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: {
        gte: fifteenMinutesAgo,
      },
    },
  });

  // Lock after 5 failed attempts
  if (recentFailures >= 5) {
    return {
      shouldLock: true,
      reason: "Too many failed login attempts",
      failedAttempts: recentFailures,
    };
  }

  // Check for rapid attempts from different IPs
  const recentAttempts = await prisma.loginAttempt.findMany({
    where: {
      email,
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
      },
    },
    select: { ipAddress: true },
    distinct: ["ipAddress"],
  });

  if (recentAttempts.length >= 3) {
    return {
      shouldLock: true,
      reason: "Multiple login attempts from different locations",
    };
  }

  return { shouldLock: false };
}

/**
 * Log OAuth account linking
 */
export async function logOAuthLink(
  userId: string,
  provider: string,
  action: "link" | "unlink",
  ipAddress: string,
  userAgent: string,
): Promise<void> {
  await logAuditEvent({
    userId,
    action: `oauth_${action}`,
    resource: "oauth_account",
    resourceId: provider,
    ipAddress,
    userAgent,
    success: true,
    metadata: { provider },
  });
}

/**
 * Log account deletion
 */
export async function logAccountDeletion(
  userId: string,
  ipAddress: string,
  userAgent: string,
  scheduled: boolean,
): Promise<void> {
  await logAuditEvent({
    userId,
    action: scheduled ? "account_deletion_scheduled" : "account_deleted",
    resource: "user",
    resourceId: userId,
    ipAddress,
    userAgent,
    success: true,
  });
}

/**
 * Log sensitive operations
 */
export async function logSensitiveOperation(
  userId: string,
  operation: string,
  resource: string,
  resourceId: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  metadata?: Record<string, any>,
  workspaceId?: string,
  repoId?: string,
): Promise<void> {
  await logAuditEvent({
    userId,
    action: operation,
    resource,
    resourceId,
    ipAddress,
    userAgent,
    success,
    metadata,
    workspaceId,
    repoId,
  });
}
