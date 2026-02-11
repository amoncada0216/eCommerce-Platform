import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/\d/, "Must contain number")
    .regex(/[@$!%*?&]/, "Must contain special character"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8)
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/\d/, "Must contain number")
      .regex(/[@$!%*?&]/, "Must contain special character"),
    newPassword: z
      .string()
      .trim()
      .min(8)
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/\d/, "Must contain number")
      .regex(/[@$!%*?&]/, "Must contain special character"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
