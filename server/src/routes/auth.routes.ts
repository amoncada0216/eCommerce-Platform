import { Router } from "express";
import bcrypt from "bcrypt";

import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { changePasswordSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", async (req, res) => {
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
      },
    });

    const token = generateToken(newUser.id, newUser.tokenVersion);

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
});

router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return res.json(user);
});

router.post("/login", async (req, res) => {
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
      },
    });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect credentials." });
    }

    const token = generateToken(existingUser.id, existingUser.tokenVersion);

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
});

router.delete("/logout", async (_, res) => {
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
});

router.post("/change-password", authMiddleware, async (req: AuthenticatedRequest, res) => {
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
      },
    });

    const token = generateToken(updatedUser.id, updatedUser.tokenVersion);

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
});

export default router;
