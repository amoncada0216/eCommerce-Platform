import type { Request, Response } from "express";

import prisma from "@/lib/prisma.lib.js";
import { listProductsQuerySchema, productSlugParamSchema } from "@/validators/product.validator.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const result = listProductsQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { page, limit } = result.data;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          brand: true,
          price: true,
          imageUrl: true,
        },
      }),
      prisma.product.count({
        where: { isActive: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export async function getProductBySlug(req: Request, res: Response) {
  try {
    const result = productSlugParamSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { slug } = result.data;

    console.log("Requested slug:", slug);
    console.log("Params:", req.params);

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json(product);
  } catch (_error) {
    return res.status(500).json({ message: "Server error." });
  }
}
