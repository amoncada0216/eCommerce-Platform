import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware.js";
import {
  addCartItem,
  clearCart,
  decreaseCartItem,
  getCurrentCart,
  increaseCartItem,
  mergeCart,
  removeCartItem,
} from "@/controllers/cart.controller.js";

const router = Router();

router.get("/", authMiddleware, getCurrentCart);

router.post("/add-cart-item", authMiddleware, addCartItem);

router.delete("/remove/:id", authMiddleware, removeCartItem);

router.post("/increase/:id", authMiddleware, increaseCartItem);

router.post("/decrease/:id", authMiddleware, decreaseCartItem);

router.post("/merge", authMiddleware, mergeCart);

router.delete("/clear", authMiddleware, clearCart);

export default router;
