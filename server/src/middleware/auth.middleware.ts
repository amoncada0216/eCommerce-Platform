import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

import { Role } from "@prisma/client";
import { env } from "@/config/env.config.js";
import prisma from "@/lib/prisma.lib.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: Role;
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
    const { payload } = await jwtVerify(token, secret);

    const decoded = payload as {
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
  } catch (_error) {
    res.status(401).json({ message: "401 Unauthorized" });
    return;
  }
}
