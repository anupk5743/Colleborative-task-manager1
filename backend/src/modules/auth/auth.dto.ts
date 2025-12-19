import { z } from "zod";

/**
 * Registration DTO
 * Validates user input for registration
 */
export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

/**
 * Login DTO
 * Validates user input for login
 */
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

/**
 * Update Profile DTO
 * Validates user input for profile updates
 */
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

/**
 * Auth Response DTO
 * Standardized response structure for auth endpoints
 */
export interface AuthResponseDto {
  id: string;
  name: string;
  email: string;
}
