import { Request, Response } from "express";

import prisma from "@/lib/prisma.lib.js";
import { bulkAddProductsSchema, bulkCommitSchema } from "@/validators/product.validator.js";
import { createBaseSlug, generateUniqueSlugTx } from "@/utils/slug.util.js";
import { Prisma } from "@prisma/client";

export async function bulkPreviewProducts(req: Request, res: Response) {
  const result = bulkAddProductsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const products = result.data;

  const preview = {
    new: [] as typeof products,
    conflicts: [] as {
      incoming: (typeof products)[number];
      existing: {
        id: string;
        name: string;
        slug: string;
      };
    }[],
  };

  for (const product of products) {
    const baseSlug = createBaseSlug(product.name);

    const existing = await prisma.product.findFirst({
      where: { slug: baseSlug },
      select: {
        id: true,
        name: true,
        brand: true,
        description: true,
        price: true,
        stock: true,
        imageUrl: true,
        isActive: true,
        slug: true,
      },
    });

    if (!existing) {
      preview.new.push(product);
    } else {
      preview.conflicts.push({
        incoming: product,
        existing,
      });
    }
  }

  return res.status(200).json(preview);
}

export async function bulkCommitProducts(req: Request, res: Response) {
  const result = bulkCommitSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const operations = result.data;

  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
  };

  try {
    await prisma.$transaction(async (tx) => {
      for (const op of operations) {
        if (op.action === "skip") {
          summary.skipped++;
          continue;
        }

        if (op.action === "create") {
          const slug = await generateUniqueSlugTx(tx, op.product.name);

          await tx.product.create({
            data: {
              ...op.product,
              slug,
              imageUrl: op.product.imageUrl ?? null,
            },
          });

          summary.created++;
          continue;
        }

        if (op.action === "update") {
          if (!op.id) {
            throw new Error("Update action requires product id.");
          }

          const existing = await tx.product.findUnique({
            where: { id: op.id },
          });

          if (!existing) {
            throw new Error(`Product not found: ${op.id}`);
          }

          await tx.product.update({
            where: { id: op.id },
            data: {
              ...op.product,
              imageUrl: op.product.imageUrl ?? null,
            } as Prisma.ProductUpdateInput,
          });

          summary.updated++;
        }
      }
    });

    return res.status(200).json(summary);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: "Bulk commit failed." });
  }
}
