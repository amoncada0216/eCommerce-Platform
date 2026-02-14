import jwt from "jsonwebtoken";

import { Role } from "@prisma/client";
import { env } from "@/config/env.js";

const JWT_SECRET = env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export function generateToken(userId: string, tokenVersion: number, role: Role) {
  return jwt.sign({ userId, tokenVersion, role }, JWT_SECRET, { expiresIn: "7d" });
}
