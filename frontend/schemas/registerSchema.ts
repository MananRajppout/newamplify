// shared/schemas/auth.ts
import { z } from "zod";

// Strong password validation function
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

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is required" })
      .max(50, { message: "First Name can be at most 50 characters long" })
      .regex(/^[A-Za-z ]+$/, {
        message: "First Name can only contain letters and spaces",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required" })
       .max(50, { message: "Last Name can be at most 50 characters long" })
      .regex(/^[A-Za-z ]+$/, {
        message: "Last Name can only contain letters and spaces",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    companyName: z
      .string()
      .min(1, { message: "Company name is required" })
      .max(50, { message: "Company Name can be at most 50 characters long" })
      .regex(/^[A-Za-z ]+$/, {
        message: "Company Name can only contain letters and spaces",
      }),
    phoneNumber: z.string().min(10, { message: "Phone number is required" }),
    password: z
      .string()
      .min(9, { message: "Password must be at least 9 characters long" })
      .refine(validateStrongPassword, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Export the inferred TypeScript type as well, if needed:
export type RegisterFormValues = z.infer<typeof registerSchema>;
