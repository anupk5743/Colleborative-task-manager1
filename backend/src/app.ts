import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";

const app = express();

/**
 * Middleware Configuration
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * API Routes
 */

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Task routes
app.use("/api/v1/tasks", taskRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

/**
 * Error Handling
 */
// 404 handler
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
