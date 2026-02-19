import { z } from "zod";

export const bulkAddProductsSchema = z.object({
  name: z.string().trim().min(3).max(120),

  brand: z.string().trim().min(2).max(60),

  description: z.string().trim().min(10).max(2000),

  price: z.number().positive(),

  stock: z.number().int().nonnegative(),

  imageUrl: z.url().optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(3).max(120).optional(),

    brand: z.string().trim().min(2).max(60).optional(),

    description: z.string().trim().min(10).max(2000).optional(),

    price: z.number().positive().optional(),

    stock: z.number().int().nonnegative().optional(),

    imageUrl: z.url().optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const listProductsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 50, {
      message: "Limit must be between 1 and 50",
    }),
});

export const productSlugParamSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug too short")
    .max(200, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
});