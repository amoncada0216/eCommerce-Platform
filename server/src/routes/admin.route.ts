import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware.js";
import { requireAdmin } from "@/middleware/admin.middleware.js";
import { bulkCommitProducts, bulkPreviewProducts } from "@/controllers/admin.controller.js";

const router = Router();

// Preview (detect conflicts, no DB writes)
router.post("/bulk-preview", authMiddleware, requireAdmin, bulkPreviewProducts);

// Commit (create / update / skip — atomic)
router.post("/bulk-commit", authMiddleware, requireAdmin, bulkCommitProducts);

export default router;
