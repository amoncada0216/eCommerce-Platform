import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  userChangePassword,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);

router.get("/me", authMiddleware, getUserInfo);

router.post("/login", loginUser);

router.delete("/logout", logoutUser);

router.post("/change-password", authMiddleware, userChangePassword);

export default router;
