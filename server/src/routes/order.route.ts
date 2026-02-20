import { Router } from "express";

import { createOrder, getOrderById, listOrders, updateOrderStatus } from "@/controllers/order.controller.js";
import { requireAdmin } from "@/middleware/admin.middleware.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const router = Router();

router.post("/create", createOrder);

router.get("/get-orders", authMiddleware, requireAdmin, listOrders);

router.get("/:id", authMiddleware, requireAdmin, getOrderById);

router.patch("/:id/status", authMiddleware, requireAdmin, updateOrderStatus);

export default router;