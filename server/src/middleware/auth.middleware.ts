import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { Role } from "@prisma/client";
import prisma from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: "USER" | "ADMIN";
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "401 Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; tokenVersion: number; role: Role };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { tokenVersion: true },
    });

    if (!user) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ message: "401 Unauthorized" });
  }
}
