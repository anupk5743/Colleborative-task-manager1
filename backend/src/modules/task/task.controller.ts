import { Request, Response } from "express";
import { taskService } from "./task.service";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterSchema,
} from "./task.dto";
import { ZodError } from "zod";

/**
 * Task Controller
 * Handles HTTP requests for tasks
 */
export class TaskController {
  /**
   * POST /api/v1/tasks
   * Create a new task (requires auth)
   */
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const data = CreateTaskSchema.parse(req.body);
      const userId = (req as any).userId;

      // Call service
      const task = await taskService.createTask(data, userId);

      res.status(201).json({
        success: true,
        data: task,
        message: "Task created successfully",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Validation failed",
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to create task",
        });
      }
    }
  }

  /**
   * GET /api/v1/tasks/:id
   * Get task by ID (requires auth)
   */
  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const task = await taskService.getTaskById(id, userId);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Task not found",
      });
    }
  }

  /**
   * GET /api/v1/tasks
   * Get all tasks for current user with filtering (requires auth)
   */
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const filter = TaskFilterSchema.parse(req.query);

      const tasks = await taskService.getUserTasks(userId, filter);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Invalid filter parameters",
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch tasks",
        });
      }
    }
  }

  /**
   * GET /api/v1/tasks/created/me
   * Get tasks created by current user (requires auth)
   */
  async getCreatedTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const filter = TaskFilterSchema.parse(req.query);

      const tasks = await taskService.getCreatedTasks(userId, filter);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Invalid filter parameters",
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch tasks",
        });
      }
    }
  }

  /**
   * GET /api/v1/tasks/assigned/me
   * Get tasks assigned to current user (requires auth)
   */
  async getAssignedTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const filter = TaskFilterSchema.parse(req.query);

      const tasks = await taskService.getAssignedTasks(userId, filter);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Invalid filter parameters",
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to fetch tasks",
        });
      }
    }
  }

  /**
   * GET /api/v1/tasks/overdue/me
   * Get overdue tasks for current user (requires auth)
   */
  async getOverdueTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const tasks = await taskService.getOverdueTasks(userId);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch overdue tasks",
      });
    }
  }

  /**
   * PUT /api/v1/tasks/:id
   * Update a task (requires auth, creator only)
   */
  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const data = UpdateTaskSchema.parse(req.body);

      const task = await taskService.updateTask(id, data, userId);

      res.status(200).json({
        success: true,
        data: task,
        message: "Task updated successfully",
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          errors: error.issues,
          message: "Validation failed",
        });
      } else if (
        error.message.includes("access") ||
        error.message.includes("creator")
      ) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: error.message || "Failed to update task",
        });
      }
    }
  }

  /**
   * DELETE /api/v1/tasks/:id
   * Delete a task (requires auth, creator only)
   */
  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await taskService.deleteTask(id, userId);

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error: any) {
      if (
        error.message.includes("access") ||
        error.message.includes("creator")
      ) {
        res.status(403).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: error.message || "Failed to delete task",
        });
      }
    }
  }
}

export const taskController = new TaskController();
