/**
 * User Types
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Auth Response Type
 */
export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

/**
 * Task Types
 */
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Query Filter Types
 */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: "dueDate" | "createdAt" | "priority";
  order?: "asc" | "desc";
}

/**
 * Dashboard Statistics
 */
export interface DashboardStats {
  totalTasks: number;
  assignedTasks: number;
  createdTasks: number;
  overdueTasks: number;
}

/**
 * Notification Types
 */
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface TaskNotification extends Notification {
  taskId: string;
  taskTitle: string;
  assignedBy?: string;
}


