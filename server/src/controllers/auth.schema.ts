import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().trim().min(1, "Password is required."),
});

export const registerSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/,
      "Password must contain at least one special character.",
    ),
  // confirmPassword: z.string().trim().refine((val, ctx) => {
  //   if (val !== ctx.parent.password) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: "Passwords must match.",
  //     });
  //   }
  // }),
});
