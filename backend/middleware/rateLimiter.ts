import { FastifyRequest, FastifyReply } from "fastify";

/**
 * Integravity Rate Limiter Middleware
 * Enforces tiered API limits using the sliding window algorithm (baseline).
 * Production implementation would use Redis (ioredis) for distributed state.
 */
export function rateLimiter() {
  // Mock store for in-memory rate limiting (Replace with Redis in production)
  const store = new Map<string, { count: number; reset: number }>();

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Identify User/IP
    const key =
      (request.user as { userId: string } | undefined)?.userId || request.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minute (Development permissive)

    // 2. Determine Tier Limits
    // Enterprise: 5000, Business: 2000, Free: 1000 (Development permissive)
    const limit = (request as { enterpriseId?: string }).enterpriseId
      ? 5000
      : 1000;

    const data = store.get(key) || { count: 0, reset: now + windowMs };

    if (now > data.reset) {
      data.count = 0;
      data.reset = now + windowMs;
    }

    data.count++;
    store.set(key, data);

    // 3. Set Headers
    reply.header("X-RateLimit-Limit", limit);
    reply.header("X-RateLimit-Remaining", Math.max(0, limit - data.count));
    reply.header("X-RateLimit-Reset", Math.ceil(data.reset / 1000));

    // 4. Enforce Limit
    if (data.count > limit) {
      console.warn(
        `[RateLimit] BLOCKED: key=${key}, count=${data.count}, limit=${limit}`,
      );
      reply.code(429).send({
        error: "Too Many Requests",
        message: `API rate limit exceeded. Retry in ${Math.ceil((data.reset - now) / 1000)} seconds.`,
      });
    } else {
      // Periodic logging to see traffic in dev
      if (data.count % 10 === 0 || data.count === 1) {
        console.log(
          `[RateLimit] ALLOW: key=${key}, count=${data.count}/${limit}`,
        );
      }
    }
  };
}
