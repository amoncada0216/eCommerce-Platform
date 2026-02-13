import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import {
  createProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

// Create new product
router.post("/add-to-db", authMiddleware, requireAdmin, createProduct);

// Update product
router.put("/:id", authMiddleware, requireAdmin, updateProduct);

// Public products
router.get("/", getProducts);

// Get product by slug
router.get("/:slug", getProductBySlug);

export default router;
