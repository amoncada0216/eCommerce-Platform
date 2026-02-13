import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(3).max(120),

  description: z.string().trim().min(10).max(2000),

  price: z.number().positive(),

  stock: z.number().int().nonnegative(),

  imageUrl: z.string().url().optional(),

  //wouldnt we want to have isActive from beggining?
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(3).max(120).optional(),

    description: z.string().trim().min(10).max(2000).optional(),

    price: z.number().positive().optional(),

    stock: z.number().int().nonnegative().optional(),

    imageUrl: z.string().url().optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided." });
