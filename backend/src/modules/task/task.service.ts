import { taskRepository } from "./task.repository";
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
  TaskResponseDto,
} from "./task.dto";
import { ITask } from "./task.model";

/**
 * Task Service
 * Handles business logic for tasks
 * Implements Service Layer pattern
 */
export class TaskService {
  /**
   * Create a new task
   * @param data - Task creation data
   * @param creatorId - User ID of task creator
   * @returns Task response DTO
   * @throws Error if validation fails
   */
  async createTask(
    data: CreateTaskDto | any,
    creatorId: string
  ): Promise<TaskResponseDto> {
    // Validate dueDate is in the future
    const dueDate = new Date(data.dueDate);
    if (dueDate <= new Date()) {
      throw new Error("Due date must be in the future");
    }

    const taskData = {
      title: data.title,
      description: data.description,
      dueDate,
      priority: data.priority,
      status: data.status,
      creatorId,
      assignedToId: data.assignedToId || undefined,
    };

    const task = await taskRepository.create(taskData);
    return this.formatTaskResponse(task);
  }

  /**
   * Get task by ID
   * @param taskId - Task ID
   * @param userId - User requesting (for access control)
   * @returns Task response DTO
   * @throws Error if task not found or user doesn't have access
   */
  async getTaskById(taskId: string, userId: string): Promise<TaskResponseDto> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check access: user should be creator or assignee
    const hasAccess = await taskRepository.hasAccess(taskId, userId);
    if (!hasAccess) {
      throw new Error("You do not have access to this task");
    }

    return this.formatTaskResponse(task);
  }

  /**
   * Get all tasks for a user (created or assigned)
   * @param userId - User ID
   * @param filter - Filter options
   * @returns Array of task response DTOs
   */
  async getUserTasks(
    userId: string,
    filter?: TaskFilterDto | any
  ): Promise<TaskResponseDto[]> {
    const tasks = await taskRepository.findAll(
      {
        status: filter?.status,
        priority: filter?.priority,
        userId,
      },
      filter?.sortBy || "dueDate",
      filter?.order || "asc"
    );

    return tasks.map((task) => this.formatTaskResponse(task));
  }

  /**
   * Get tasks created by a user
   * @param userId - User ID
   * @param filter - Filter options
   * @returns Array of task response DTOs
   */
  async getCreatedTasks(
    userId: string,
    filter?: TaskFilterDto | any
  ): Promise<TaskResponseDto[]> {
    let tasks = await taskRepository.findByCreatorId(userId);

    // Apply filters
    if (filter?.status) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }
    if (filter?.priority) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      const sortKey = filter?.sortBy || "dueDate";
      const order = filter?.order || "asc";

      let compareA = (a as any)[sortKey];
      let compareB = (b as any)[sortKey];

      if (order === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return tasks.map((task) => this.formatTaskResponse(task));
  }

  /**
   * Get tasks assigned to a user
   * @param userId - User ID
   * @param filter - Filter options
   * @returns Array of task response DTOs
   */
  async getAssignedTasks(
    userId: string,
    filter?: TaskFilterDto | any
  ): Promise<TaskResponseDto[]> {
    let tasks = await taskRepository.findByAssignedToId(userId);

    // Apply filters
    if (filter?.status) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }
    if (filter?.priority) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      const sortKey = filter?.sortBy || "dueDate";
      const order = filter?.order || "asc";

      let compareA = (a as any)[sortKey];
      let compareB = (b as any)[sortKey];

      if (order === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return tasks.map((task) => this.formatTaskResponse(task));
  }

  /**
   * Get overdue tasks for a user
   * @param userId - User ID
   * @returns Array of overdue task response DTOs
   */
  async getOverdueTasks(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await taskRepository.findOverdueByUserId(userId);
    return tasks.map((task) => this.formatTaskResponse(task));
  }

  /**
   * Update a task
   * @param taskId - Task ID
   * @param data - Update data
   * @param userId - User requesting update (for access control)
   * @returns Updated task response DTO
   * @throws Error if task not found, user doesn't have access, or validation fails
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskDto | any,
    userId: string
  ): Promise<TaskResponseDto> {
    // Check task exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check access: only creator can update
    if (task.creatorId.toString() !== userId) {
      throw new Error("Only task creator can update this task");
    }

    // Validate dueDate if provided
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (dueDate <= new Date()) {
        throw new Error("Due date must be in the future");
      }
      data.dueDate = dueDate as any;
    }

    const updatedTask = await taskRepository.update(taskId, data);
    if (!updatedTask) {
      throw new Error("Failed to update task");
    }

    return this.formatTaskResponse(updatedTask);
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @param userId - User requesting delete (for access control)
   * @throws Error if task not found or user doesn't have access
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    // Check task exists
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Check access: only creator can delete
    if (task.creatorId.toString() !== userId) {
      throw new Error("Only task creator can delete this task");
    }

    await taskRepository.delete(taskId);
  }

  /**
   * Format task response
   * @param task - Task document
   * @returns Formatted task response
   * @private
   */
  private formatTaskResponse(task: ITask): TaskResponseDto {
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      creatorId: task.creatorId.toString(),
      assignedToId: task.assignedToId?.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export const taskService = new TaskService();
