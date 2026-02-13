import { Router, type Request, type Response } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { addCartItem, decreaseCartItem, increaseCartItem, removeCartItem } from "../controllers/cart.controller.js";

const router = Router();

router.post("/add-cart-item", authMiddleware, addCartItem);

router.delete("/remove/:id", authMiddleware, removeCartItem);

router.post("/increase/:id", authMiddleware, increaseCartItem);

router.post("/decrease/:id", authMiddleware, decreaseCartItem);

export default router;