import { Task, ITask } from "./task.model";
import mongoose from "mongoose";

/**
 * Task Repository
 * Handles all database operations for tasks
 * Implements the Data Access Layer (DAL) pattern
 */
export class TaskRepository {
  /**
   * Create a new task
   * @param taskData - Task creation data
   * @returns Created task document
   */
  async create(taskData: {
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    creatorId: string;
    assignedToId?: string;
  }): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  }

  /**
   * Find task by ID
   * @param id - Task ID
   * @returns Task document or null
   */
  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Find all tasks created by a user
   * @param userId - Creator user ID
   * @returns Array of task documents
   */
  async findByCreatorId(userId: string): Promise<ITask[]> {
    return await Task.find({ creatorId: userId })
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Find all tasks assigned to a user
   * @param userId - Assignee user ID
   * @returns Array of task documents
   */
  async findByAssignedToId(userId: string): Promise<ITask[]> {
    return await Task.find({ assignedToId: userId })
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Find all tasks with optional filtering and sorting
   * @param filter - Filter options (status, priority)
   * @param sortBy - Field to sort by
   * @param order - Sort order (asc or desc)
   * @returns Array of task documents
   */
  async findAll(
    filter?: {
      status?: string;
      priority?: string;
      userId?: string;
    },
    sortBy: string = "dueDate",
    order: "asc" | "desc" = "asc"
  ): Promise<ITask[]> {
    const query: any = {};

    // Apply filters
    if (filter?.status) query.status = filter.status;
    if (filter?.priority) query.priority = filter.priority;
    if (filter?.userId) {
      query.$or = [
        { creatorId: filter.userId },
        { assignedToId: filter.userId },
      ];
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = order === "asc" ? 1 : -1;

    return await Task.find(query)
      .sort(sortObj)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Find overdue tasks for a user
   * @param userId - User ID
   * @returns Array of overdue task documents
   */
  async findOverdueByUserId(userId: string): Promise<ITask[]> {
    const now = new Date();
    return await Task.find({
      $or: [
        { creatorId: userId },
        { assignedToId: userId },
      ],
      dueDate: { $lt: now },
      status: { $ne: "Completed" },
    })
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Update a task
   * @param id - Task ID
   * @param updateData - Data to update
   * @returns Updated task document
   */
  async update(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .exec();
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Deleted task document
   */
  async delete(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id).exec();
  }

  /**
   * Check if user has access to task (is creator or assignee)
   * @param taskId - Task ID
   * @param userId - User ID
   * @returns Boolean indicating if user has access
   */
  async hasAccess(taskId: string, userId: string): Promise<boolean> {
    const task = await Task.findById(taskId).exec();
    if (!task) return false;

    return (
      task.creatorId.toString() === userId ||
      task.assignedToId?.toString() === userId
    );
  }
}

export const taskRepository = new TaskRepository();
