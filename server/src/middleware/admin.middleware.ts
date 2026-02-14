import type { Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "./auth.middleware.js";

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.role !== "ADMIN") {
    console.log("ROLE:", req.role);
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
}
