import type { Response } from "express";

import prisma from "@/lib/prisma.lib.js";
import type { AuthenticatedRequest } from "@/middleware/auth.middleware.js";
import { addToCartSchema } from "@/validators/cart.validator.js";

export async function addCartItem(req: AuthenticatedRequest, res: Response) {
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
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function removeCartItem(req: AuthenticatedRequest, res: Response) {
  try {
    const itemIdParam = req.params.id;

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      return res.status(400).json({ message: "Invalid item id." });
    }

    const itemId = itemIdParam;

    if (!itemId) {
      return res.status(400).json({ message: "Invalid item id." });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    if (cartItem.cart.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return res.status(200).json({ message: "Item removed." });
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function increaseCartItem(req: AuthenticatedRequest, res: Response) {
  try {
    const itemIdParam = req.params.id;

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      return res.status(400).json({ message: "Invalid item id." });
    }

    const itemId = itemIdParam;

    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    if (cartItem.cart.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    if (cartItem.quantity + 1 > cartItem.product.stock) {
      return res.status(400).json({ message: "Insufficient stock." });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: { increment: 1 },
      },
    });

    return res.status(200).json({ message: "Cart updated." });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function decreaseCartItem(req: AuthenticatedRequest, res: Response) {
  try {
    const itemIdParam = req.params.id;

    if (!itemIdParam || Array.isArray(itemIdParam)) {
      return res.status(400).json({ message: "Invalid item id." });
    }

    const itemId = itemIdParam;

    if (!itemId) {
      return res.status(400).json({ message: "Invalid item id." });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    if (cartItem.cart.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    if (cartItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: { decrement: 1 },
        },
      });
    } else {
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
    }

    return res.status(200).json({ message: "Cart updated." });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getCurrentCart(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "401 Unauthorized" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(cart);
  } catch {
    return res.status(500).json({ message: "Server error." });
  }
}
