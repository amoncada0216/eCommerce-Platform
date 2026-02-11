import express from "express";
import cookieParser from "cookie-parser";

import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", async (_, res) => {
  try {
    await prisma.user.count();
    return res.json({ status: "ok" });
  } catch {
    return res.status(500).json({ status: "error" });
  }
});

app.use("/api/v1/auth", authRoutes);

export default app;
