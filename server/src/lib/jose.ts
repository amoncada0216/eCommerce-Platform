import { SignJWT } from "jose";
import { Role } from "@prisma/client";
import { env } from "@/config/env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function generateToken(userId: string, tokenVersion: number, role: Role) {
  return await new SignJWT({ userId, tokenVersion, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secret);
}
