import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load .env explicitly if needed, though running via 'npm run dev' usually handles it
dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().url(),

  // Security
  COOKIE_SECRET: z
    .string()
    .min(32, "COOKIE_SECRET must be at least 32 characters"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters")
    .optional(), // If using JWTs alongside sessions

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Redis (Optional for dev, recommended for prod)
  REDIS_URL: z.string().url().optional(),

  // Frontend
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
});

// Parse and validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const fs = await import("fs");
  const errorMsg = `❌ Invalid environment variables: ${JSON.stringify(_env.error.format(), null, 2)}`;
  console.error(errorMsg);
  try {
    fs.appendFileSync(
      "env_error.log",
      `\n[${new Date().toISOString()}]\n${errorMsg}\n`,
    );
  } catch (err) {
    // ignore
  }
  process.exit(1);
}

export const env = _env.data;
