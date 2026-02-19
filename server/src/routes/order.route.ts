import { createOrder } from "@/controllers/order.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", createOrder);

export default router;