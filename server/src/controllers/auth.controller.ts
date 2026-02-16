import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { Role } from "@prisma/client";
import { changePasswordSchema, registerSchema } from "@/validators/auth.validator.js";
import prisma from "@/lib/prisma.js";
import { generateToken } from "@/lib/jose.js";
import type { AuthenticatedRequest } from "@/middleware/auth.middleware.js";
import { env } from "@/config/env.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        tokenVersion: 0,
        role: Role.USER,
        isActive: true,
      },
    });

    const token = generateToken(newUser.id, newUser.tokenVersion, newUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
    });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getUserInfo(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  return res.json(user);
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        tokenVersion: true,
        role: true,
        failedLoginAttempts: true,
        lockUntil: true,
      },
    });

    // Prevent user enumeration
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockUntil:
            attempts >= env.MAX_LOGIN_ATTEMPTS
              ? new Date(Date.now() + env.LOCK_DURATION_MINUTES * 60 * 1000)
              : null,
        },
      });

      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Successful login → reset counters
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    });

    const token = await generateToken(user.id, user.tokenVersion, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      id: user.id,
      email: user.email,
    });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function logoutUser(_: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out." });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function userChangePassword(req: AuthenticatedRequest, res: Response) {
  try {
    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { currentPassword, newPassword } = result.data;

    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, passwordHash: true, tokenVersion: true },
    });

    if (!user) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        tokenVersion: { increment: 1 },
      },
      select: {
        id: true,
        tokenVersion: true,
        role: true,
      },
    });

    const token = generateToken(updatedUser.id, updatedUser.tokenVersion, updatedUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}
