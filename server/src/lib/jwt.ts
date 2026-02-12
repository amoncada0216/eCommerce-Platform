import jwt from "jsonwebtoken";

import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}

export function generateToken(userId: string, tokenVersion: number, role: Role) {
  return jwt.sign({ userId, tokenVersion, role }, JWT_SECRET, { expiresIn: "7d" });
}
