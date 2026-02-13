import type { Request, Response } from "express";

import prisma from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { addToCartSchema } from "../validators/cart.validator.js";

export async function addItemToCart(req: AuthenticatedRequest, res: Response) {
  try {
    const result = addToCartSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { productId, quantity } = result.data;

    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const cart = await prisma.cart.upsert({
      where: { userId: req.userId },
      update: {},
      create: { userId: req.userId },
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        return res.status(400).json({ message: "Insufficient stock." });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: quantity },
        },
      });
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: "Insufficient stock." });
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return res.status(200).json({ message: "Added to cart." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}
