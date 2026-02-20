import { Request, Response } from "express";

import prisma from "@/lib/prisma.lib.js";
import { Prisma, OrderStatus } from "@prisma/client";
import { createOrderSchema, updateOrderStatusSchema } from "@/validators/order.validator.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const idempotencyKey = req.header("Idempotency-Key");

    if (!idempotencyKey) {
      return res.status(400).json({ message: "Missing Idempotency-Key header." });
    }

    // Check if order already exists for this key
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey },
    });

    if (existingOrder) {
      return res.status(200).json({ orderId: existingOrder.id });
    }

    const { items, shipping } = result.data;

    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Invalid product in cart." });
    }

    const order = await prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0);

      const orderItemsData: {
        productId: string;
        productName: string;
        unitPrice: Prisma.Decimal;
        quantity: number;
      }[] = [];

      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new Error("Product not found.");
        }

        if (item.quantity > product.stock) {
          throw new Error("Insufficient stock.");
        }

        const unitPrice = new Prisma.Decimal(product.price);
        const lineTotal = unitPrice.mul(item.quantity);

        subtotal = subtotal.plus(lineTotal);

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          unitPrice,
          quantity: item.quantity,
        });
      }

      const total = subtotal;

      const createdOrder = await tx.order.create({
        data: {
          idempotencyKey,
          subtotal,
          total,
          currency: "USD",
          shippingName: shipping.name,
          shippingEmail: shipping.email,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingPostal: shipping.postal,
          shippingCountry: shipping.country,
          items: {
            create: orderItemsData,
          },
          orderStatusHistories: {
            create: {
              status: "PENDING",
            },
          },
        },
        include: {
          items: true,
        },
      });

      return createdOrder;
    });

    return res.status(201).json({ orderId: order.id });
  } catch (_error) {
    return res.status(400).json({ message: "Order failed." });
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const status = req.query.status as OrderStatus | undefined;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: true,
          orderStatusHistories: {
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return res.status(200).json({
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch orders." });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const rawId = req.params.id;

    if (typeof rawId !== "string") {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const id = rawId;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        orderStatusHistories: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json(order);
  } catch {
    return res.status(500).json({ message: "Failed to fetch order." });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const rawId = req.params.id;

    if (typeof rawId !== "string") {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const id = rawId;

    const result = updateOrderStatusSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const status = result.data.status as OrderStatus;

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Order not found.");
      }

      const order = await tx.order.update({
        where: { id },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
        },
      });

      return order;
    });

    return res.status(200).json(updatedOrder);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Order not found.") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to update order status." });
  }
}
