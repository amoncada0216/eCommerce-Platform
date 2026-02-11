import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

app.get("/api/v1/health", async (_, res) => {
  try {
    await prisma.user.count();
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

export default app;