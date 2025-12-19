import { Request, Response, NextFunction } from "express";
import { authService } from "../modules/auth/auth.service";

/**
 * Authenticate Token Middleware
 * Verifies JWT token from HttpOnly cookie and adds userId to request
 * Protected routes should use this middleware
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    (req as any).userId = decoded.userId;

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};
