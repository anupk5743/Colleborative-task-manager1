import { TaskService } from "../modules/task/task.service";
import { taskRepository } from "../modules/task/task.repository";

// Mock dependencies
jest.mock("../modules/task/task.repository");

describe("TaskService", () => {
  let taskService: TaskService;
  let mockTask: any;

  beforeEach(() => {
    taskService = new TaskService();
    mockTask = {
      _id: "task123",
      title: "Test Task",
      description: "Test description",
      dueDate: new Date("2025-12-31"),
      priority: "High",
      status: "To Do",
      creatorId: "creator123",
      assignedToId: "assignee123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    /**
     * Test 1: Successful task creation
     * Should create task when all data is valid
     */
    it("should successfully create a task", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const createData = {
        title: "New Task",
        description: "New task description",
        dueDate: futureDate.toISOString(),
        priority: "High",
        status: "To Do" as const,
        assignedToId: "assignee123",
      };

      (taskRepository.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(createData, "creator123");

      expect(taskRepository.create).toHaveBeenCalled();
      expect(result.title).toBe(mockTask.title);
      expect(result.creatorId).toBe(mockTask.creatorId.toString());
    });

    /**
     * Test 2: Task creation with past due date
     * Should throw error when due date is in the past
     */
    it("should throw error if due date is in the past", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const createData = {
        title: "Past Task",
        description: "Task with past due date",
        dueDate: pastDate.toISOString(),
        priority: "High" as const,
        status: "To Do" as const,
      };

      await expect(
        taskService.createTask(createData, "creator123")
      ).rejects.toThrow("Due date must be in the future");

      expect(taskRepository.create).not.toHaveBeenCalled();
    });

    /**
     * Test 3: Task access control
     * Should only allow creator to update task
     */
    it("should throw error if non-creator tries to update", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);

      const updateData = {
        title: "Updated Title",
      };

      const differentUserId = "different-user";

      await expect(
        taskService.updateTask("task123", updateData, differentUserId)
      ).rejects.toThrow("Only task creator can update this task");
    });
  });

  describe("getTaskById", () => {
    /**
     * Test 4: Get task with valid access
     * Should return task when user has access
     */
    it("should retrieve task when user is creator", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.hasAccess as jest.Mock).mockResolvedValue(true);

      const result = await taskService.getTaskById("task123", "creator123");

      expect(taskRepository.findById).toHaveBeenCalledWith("task123");
      expect(result.title).toBe(mockTask.title);
    });

    /**
     * Test 5: Get non-existent task
     * Should throw error when task not found
     */
    it("should throw error if task not found", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTaskById("nonexistent", "user123")).rejects.toThrow(
        "Task not found"
      );
    });

    /**
     * Test 6: Access denied to task
     * Should throw error when user doesn't have access
     */
    it("should throw error if user doesn't have access to task", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.hasAccess as jest.Mock).mockResolvedValue(false);

      await expect(taskService.getTaskById("task123", "unauthorized-user")).rejects.toThrow(
        "You do not have access to this task"
      );
    });
  });

  describe("getUserTasks", () => {
    /**
     * Test 7: Get user tasks with filtering
     * Should return filtered and sorted tasks
     */
    it("should retrieve user tasks with filters", async () => {
      const tasks = [mockTask];
      (taskRepository.findAll as jest.Mock).mockResolvedValue(tasks);

      const filter = {
        status: "To Do",
        sortBy: "dueDate" as const,
        order: "asc" as const,
      };

      const result = await taskService.getUserTasks("user123", filter);

      expect(taskRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "To Do",
          userId: "user123",
        }),
        "dueDate",
        "asc"
      );
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe(mockTask.title);
    });
  });

  describe("deleteTask", () => {
    /**
     * Test 8: Delete task as creator
     * Should successfully delete when user is creator
     */
    it("should successfully delete task when user is creator", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.delete as jest.Mock).mockResolvedValue(mockTask);

      await taskService.deleteTask("task123", "creator123");

      expect(taskRepository.delete).toHaveBeenCalledWith("task123");
    });

    /**
     * Test 9: Delete task as non-creator
     * Should throw error when user is not creator
     */
    it("should throw error if non-creator tries to delete", async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);

      await expect(taskService.deleteTask("task123", "other-user")).rejects.toThrow(
        "Only task creator can delete this task"
      );

      expect(taskRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("getOverdueTasks", () => {
    /**
     * Test 10: Get overdue tasks
     * Should return only overdue incomplete tasks
     */
    it("should retrieve overdue tasks for user", async () => {
      const overdueTasks = [mockTask];
      (taskRepository.findOverdueByUserId as jest.Mock).mockResolvedValue(
        overdueTasks
      );

      const result = await taskService.getOverdueTasks("user123");

      expect(taskRepository.findOverdueByUserId).toHaveBeenCalledWith("user123");
      expect(result).toHaveLength(1);
    });
  });
});
