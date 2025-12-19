import { Request, Response, NextFunction } from "express";

/**
 * Error Handling Middleware
 * Catches all errors and returns standardized error responses
 * Should be registered last in middleware chain
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // MongoDB validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  }

  // MongoDB cast errors
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // MongoDB duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

/**
 * Not Found Middleware
 * Handle 404 errors for undefined routes
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
