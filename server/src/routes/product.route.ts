import { Router } from "express";

import {
  getProductBySlug,
  getProducts,
} from "@/controllers/product.controller.js";

const router = Router();

// Get products list
router.get("/", getProducts);

// Get product by slug
router.get("/:slug", getProductBySlug);

export default router;
