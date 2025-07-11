// schemas/resetPasswordSchema.ts
import { z } from "zod";

// Strong password validation function (matching the one in registerSchema)
const validateStrongPassword = (password: string): boolean => {
  const requirements = [
    password.length >= 9, // At least 9 characters
    /[A-Z]/.test(password), // Uppercase letter
    /[a-z]/.test(password), // Lowercase letter
    /[0-9]/.test(password), // Number
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), // Special character
  ];
  return requirements.every(Boolean);
};

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(9, { message: "Password must be at least 9 characters long" })
      .refine(validateStrongPassword, {
        message: "Password must contain uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordDefaults: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
}; 