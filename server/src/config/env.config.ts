import { z } from "zod";

import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
  BASE_URL: z.url(),
  JWT_EXPIRES_IN: z.string(),
  MAX_LOGIN_ATTEMPTS: z.coerce.number().default(5),
  LOCK_DURATION_MINUTES: z.coerce.number().default(15),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
