import { Router, type Request, type Response } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { addItemToCart } from "../controllers/cart.controller.js";

const router = Router();

router.post("/add-to-cart", authMiddleware, addItemToCart);
