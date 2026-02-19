import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().int().min(1).default(1),
});