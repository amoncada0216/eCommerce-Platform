import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { Role } from "@prisma/client";
import { env } from "@/config/env.js";

import prisma from "../lib/prisma.js";

const JWT_SECRET = env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: "USER" | "ADMIN";
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "401 Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      tokenVersion: number;
      role: Role;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { tokenVersion: true },
    });

    if (!user) {
      res.status(401).json({ message: "401 Unauthorized" });
      return;
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      res.status(401).json({ message: "401 Unauthorized" });
      return;
    }

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ message: "401 Unauthorized" });
    return;
  }
}
