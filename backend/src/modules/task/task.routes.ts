import { Router } from "express";
import { taskController } from "./task.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * Task Routes (all protected with authentication)
 * GET /api/v1/tasks - Get all user's tasks with filtering
 * GET /api/v1/tasks/:id - Get specific task
 * GET /api/v1/tasks/created/me - Get tasks created by user
 * GET /api/v1/tasks/assigned/me - Get tasks assigned to user
 * GET /api/v1/tasks/overdue/me - Get overdue tasks
 * POST /api/v1/tasks - Create new task
 * PUT /api/v1/tasks/:id - Update task
 * DELETE /api/v1/tasks/:id - Delete task
 */

// Apply authentication to all task routes
router.use(authenticateToken);

// Create task
router.post("/", (req, res) => taskController.createTask(req, res));

// Get all tasks (must be before /:id routes)
router.get("/", (req, res) => taskController.getTasks(req, res));

// Get created tasks
router.get("/created/me", (req, res) => taskController.getCreatedTasks(req, res));

// Get assigned tasks
router.get("/assigned/me", (req, res) => taskController.getAssignedTasks(req, res));

// Get overdue tasks
router.get("/overdue/me", (req, res) => taskController.getOverdueTasks(req, res));

// Get specific task by ID
router.get("/:id", (req, res) => taskController.getTask(req, res));

// Update task
router.put("/:id", (req, res) => taskController.updateTask(req, res));

// Delete task
router.delete("/:id", (req, res) => taskController.deleteTask(req, res));

export default router;
