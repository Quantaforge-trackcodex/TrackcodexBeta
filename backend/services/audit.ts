import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Integravity Audit Service: Immutable & Enterprise-wide Logging
 * Matches GitHub Enterprise behavior for audit trails and compliance.
 */

export class AuditService {
  /**
   * Log an administrative or security-sensitive action.
   */
  static async log(data: {
    enterpriseId?: string;
    actorId: string;
    action: string;
    resource: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      // 1. Fetch previous Audit Log hash (Global or per Entity)
      // For enterprise scale, we chain per Enterprise OR global.
      // Doing global chaining is safer for high integrity.
      const lastLog = await prisma.auditLog.findFirst({
        orderBy: { createdAt: "desc" },
        select: { eventHash: true },
      });

      const previousHash =
        lastLog?.eventHash ||
        "0000000000000000000000000000000000000000000000000000000000000000";

      // 2. Calculate New Hash
      const { createHash } = await import("crypto");
      const hash = createHash("sha256");
      hash.update(previousHash);
      hash.update(data.actorId);
      hash.update(data.action);
      hash.update(data.resource);
      // Ensure details are stringified deterministically or handled safely
      hash.update(JSON.stringify(data.details || {}));
      hash.update(new Date().toISOString()); // We use approximate time, but in real chain we use the inserted createdAt
      // In Prisma, we can't easily predict createdAt before insert.
      // So we must generate a UUID or use a deterministic timestamp if we want 100% repro.
      // For now, let's include a nonce or UUID.
      // Better: we calculate hash AFTER insert? No, then it's mutable.
      // Trusted timestamping: we generate timestamp HERE.
      const timestamp = new Date();

      const payload = `${previousHash}|${data.actorId}|${data.action}|${data.resource}|${JSON.stringify(data.details)}|${timestamp.toISOString()}`;
      const eventHash = createHash("sha256").update(payload).digest("hex");

      const entry = await prisma.auditLog.create({
        data: {
          enterpriseId: data.enterpriseId || "default",
          actorId: data.actorId,
          action: data.action,
          resource: data.resource,
          details: data.details || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          createdAt: timestamp,
          previousEventHash: previousHash,
          eventHash: eventHash,
        },
      });

      // Also log to console for development observability in Integravity mode
      console.log(
        `\x1b[35m[INTEGRAVITY-AUDIT] ${data.action} by ${data.actorId} on ${data.resource}\x1b[0m`,
      );

      return entry;
    } catch (e) {
      console.error("CRITICAL: Failed to write immutable audit log", e);
      // In a high-integrity system, you might want to throw here to block the action
      // if the audit log cannot be written (fail-secure).
    }
  }

  /**
   * Fetch audit logs for an enterprise with filtering and pagination.
   */
  static async getEnterpriseLogs(
    enterpriseId: string,
    options: {
      limit?: number;
      offset?: number;
      action?: string;
    } = {},
  ) {
    return await prisma.auditLog.findMany({
      where: {
        enterpriseId,
        ...(options.action ? { action: options.action } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: options.limit || 100,
      skip: options.offset || 0,
    });
  }
}
