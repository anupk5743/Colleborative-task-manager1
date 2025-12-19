import { Request, Response } from "express";
import { authService } from "./auth.service";
import { LoginSchema, RegisterSchema, UpdateProfileSchema } from "./auth.dto";
import { ZodError } from "zod";

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = RegisterSchema.parse(req.body);

      // Call service
      const result = await authService.register(data);

      // Set token in HttpOnly cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: result.user,
        token: result.token,
        message: "User registered successfully",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Validation failed",
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Registration failed",
        });
      }
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = LoginSchema.parse(req.body);

      // Call service
      const result = await authService.login(data);

      // Set token in HttpOnly cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: result.user,
        token: result.token,
        message: "Login successful",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Validation failed",
        });
      } else {
        res.status(401).json({
          success: false,
          message: error.message || "Login failed",
        });
      }
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Logout user
   */
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }

  /**
   * GET /api/v1/auth/me
   * Get current user profile (requires auth)
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  }

  /**
   * PUT /api/v1/auth/profile
   * Update user profile (requires auth)
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = UpdateProfileSchema.parse(req.body);

      // Get user ID from request
      const userId = (req as any).userId;

      // Call service
      const user = await authService.updateProfile(userId, data);

      res.status(200).json({
        success: true,
        data: user,
        message: "Profile updated successfully",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Validation failed",
        });
      } else {
        res.status(404).json({
          success: false,
          message: error.message || "Update failed",
        });
      }
    }
  }
}

export const authController = new AuthController();
