import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),

  shipping: z.object({
    name: z.string().min(2),
    email: z.email(),
    address: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postal: z.string().min(2),
    country: z.string().min(2),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
