import { z } from "zod";

/**
 * Create Task DTO
 * Validates input for creating a new task
 */
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required"),
  dueDate: z.string().datetime("Invalid date format"),
  priority: z
    .enum(["Low", "Medium", "High", "Urgent"])
    .default("Medium"),
  status: z
    .enum(["To Do", "In Progress", "Review", "Completed"])
    .default("To Do"),
  assignedToId: z.string().optional().nullable(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

/**
 * Update Task DTO
 * Validates input for updating a task
 */
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .optional(),
  dueDate: z.string().datetime("Invalid date format").optional(),
  priority: z
    .enum(["Low", "Medium", "High", "Urgent"])
    .optional(),
  status: z
    .enum(["To Do", "In Progress", "Review", "Completed"])
    .optional(),
  assignedToId: z.string().optional().nullable(),
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;

/**
 * Task Query Filter DTO
 * Validates filter parameters for task queries
 */
export const TaskFilterSchema = z.object({
  status: z
    .enum(["To Do", "In Progress", "Review", "Completed"])
    .optional(),
  priority: z
    .enum(["Low", "Medium", "High", "Urgent"])
    .optional(),
  sortBy: z.enum(["dueDate", "createdAt", "priority"]).default("dueDate"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type TaskFilterDto = z.infer<typeof TaskFilterSchema>;

/**
 * Task Response DTO
 * Standardized response structure for tasks
 */
export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
}
