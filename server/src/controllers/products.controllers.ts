import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import prisma from "../lib/prisma.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createProductSchema,
  listProductsQuerySchema,
  productSlugParamSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const result = createProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const { name, brand, description, price, stock, imageUrl } = result.data;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brand,
        description,
        price: new Prisma.Decimal(price),
        stock,
        imageUrl: imageUrl ?? null,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({
        message: "Product with this slug already exists.",
      });
    }

    return res.status(500).json({ message: "Server error." });
  }
}

export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const result = updateProductSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    const data = result.data;

    const updateData: Prisma.ProductUpdateInput = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    if (data.brand !== undefined) {
      updateData.brand = data.brand;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }

    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }

    if (data.imageUrl !== undefined) {
      updateData.imageUrl = data.imageUrl ?? null;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Product not found." });
      }

      if (error.code === "P2002") {
        return res.status(409).json({ message: "Slug already exists." });
      }
    }

    return res.status(500).json({ message: "Server error." });
  }
}

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
  } catch (error) {
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
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}
