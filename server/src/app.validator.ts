import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import prisma from "@/lib/prisma.lib.js";
import authRouter from "@/routes/auth.route.js";
import productRouter from "@/routes/product.route.js";
import cartRouter from "@/routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/api/v1/health", async (_, res) => {
  try {
    await prisma.user.count();
    return res.json({ status: "ok" });
  } catch {
    return res.status(500).json({ status: "error" });
  }
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/admin", adminRouter);

export default app;
