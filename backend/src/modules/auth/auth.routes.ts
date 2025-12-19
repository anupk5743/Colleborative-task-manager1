import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * Auth Routes
 * POST /api/v1/auth/register - Register new user
 * POST /api/v1/auth/login - Login user
 * POST /api/v1/auth/logout - Logout user
 * GET /api/v1/auth/me - Get current user profile (protected)
 * PUT /api/v1/auth/profile - Update profile (protected)
 */

// Public routes
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));

// Protected routes
router.get("/me", authenticateToken, (req, res) =>
  authController.getProfile(req, res)
);
router.put("/profile", authenticateToken, (req, res) =>
  authController.updateProfile(req, res)
);

export default router;
