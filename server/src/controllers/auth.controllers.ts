import type { Request, Response } from "express";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

import { changePasswordSchema, registerSchema } from "../validators/auth.validator.js";
import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

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
      },
    });

    const token = generateToken(newUser.id, newUser.tokenVersion, newUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
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
    return res.status(400).json({ message: "Email and password required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        tokenVersion: true,
        role: true,
      },
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect credentials." });
    }

    const token = generateToken(existingUser.id, existingUser.tokenVersion, existingUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ id: existingUser.id, email: existingUser.email });
  } catch (error) {
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
  } catch (error) {
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
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}
