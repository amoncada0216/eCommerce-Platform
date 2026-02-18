import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware.js";
import {
  forgotPassword,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  userChangePassword,
} from "@/controllers/auth.controller.js";
import { loginRateLimiter } from "@/middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", registerUser);

router.get("/me", authMiddleware, getUserInfo);

router.post("/login", loginRateLimiter, loginUser);

router.delete("/logout", logoutUser);

router.post("/change-password", authMiddleware, userChangePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
