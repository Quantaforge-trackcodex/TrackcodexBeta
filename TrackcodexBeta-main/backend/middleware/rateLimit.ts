/**
 * Rate Limiting Configuration
 * Defines rate limits for different authentication endpoints
 */

import { FastifyRequest, FastifyReply } from "fastify";

// Rate limit configurations
export const rateLimitConfig = {
  // Login attempts: 100 per minute (Development permissive)
  login: {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many login attempts. Please try again in a minute.",
      retryAfter: 60,
    }),
  },

  // Registration: 50 per minute
  register: {
    max: 50,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many registration attempts. Please try again soon.",
      retryAfter: 60,
    }),
  },

  // OAuth: 100 per minute
  oauth: {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many OAuth attempts. Please try again soon.",
      retryAfter: 60,
    }),
  },

  // Password reset: 50 per minute
  passwordReset: {
    max: 50,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many password reset requests. Please try again soon.",
      retryAfter: 60,
    }),
  },

  // OTP sending: 50 per minute
  otpSend: {
    max: 50,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Too many OTP requests. Please try again soon.",
      retryAfter: 60,
    }),
  },

  // General API: 1000 requests per minute
  general: {
    max: 1000,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please slow down.",
      retryAfter: 60,
    }),
  },
};

/**
 * Custom key generator for rate limiting
 * Uses IP address + user ID if authenticated
 */
export function rateLimitKeyGenerator(request: FastifyRequest): string {
  const ip = request.ip;
  const userId = (request as any).user?.userId;

  // Include user ID if authenticated to prevent one user from blocking others
  return userId ? `${ip}:${userId}` : ip;
}

/**
 * Add Retry-After header on rate limit
 */
export function rateLimitErrorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  reply.code(429);
  reply.header("Retry-After", "900"); // 15 minutes in seconds
}
