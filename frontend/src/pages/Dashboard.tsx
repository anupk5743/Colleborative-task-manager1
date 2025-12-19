import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import type { Task, User, TaskFilters } from "../types";
import { useSocket } from "../hooks/useSocket";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import Navbar from "../components/Navbar";

type DashboardView = "all" | "created" | "assigned" | "overdue";

/**
 * Dashboard Page
 * Main application page showing tasks and statistics
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<DashboardView>("all");
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // socket state not needed; useSocket hook manages the connection

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Initialize socket
  const { notifications, subscribe, unsubscribe, emit } = useSocket(token);

  // Fetch current user
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.data);
      return response.data.data;
    },
    enabled: !!token,
  });

  // Fetch tasks based on view
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks", view, filters],
    queryFn: async () => {
      let endpoint = "/tasks";
      if (view === "created") endpoint = "/tasks/created/me";
      else if (view === "assigned") endpoint = "/tasks/assigned/me";
      else if (view === "overdue") endpoint = "/tasks/overdue/me";

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.order) params.append("order", filters.order);

      const response = await axiosInstance.get(
        `${endpoint}?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!token,
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (data: { taskId: string; updates: Partial<Task> }) => {
      const response = await axiosInstance.put(`/tasks/${data.taskId}`, data.updates);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Emit real-time update
      emit("task:statusChanged", { taskId: editingTask?.id });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await axiosInstance.delete(`/tasks/${taskId}`);
      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      emit("task:deleted", { taskId });
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to delete task");
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post("/tasks", data);
      return response.data.data;
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowTaskForm(false);
      emit("task:created", { taskId: newTask.id, title: newTask.title });
    },
  });

  // Subscribe to real-time events
  useEffect(() => {
    const onStatusChanged = () => refetchTasks();
    const onAssigned = () => refetchTasks();

    subscribe("task:statusChanged", onStatusChanged);
    subscribe("task:assigned", onAssigned);

    return () => {
      // Cleanup listeners on unmount
      unsubscribe("task:statusChanged");
      unsubscribe("task:assigned");
    };
  }, [subscribe, refetchTasks]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} notifications={notifications} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            + New Task
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {(["all", "created", "assigned", "overdue"] as DashboardView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 font-semibold capitalize ${view === v
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {v === "created" ? "Created" : v === "assigned" ? "Assigned" : v === "overdue" ? "Overdue" : "All Tasks"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value as TaskFilters["status"] })
              }
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filters.priority || ""}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value as TaskFilters["priority"] })
              }
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <select
              value={filters.sortBy || "dueDate"}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as TaskFilters["sortBy"] })
              }
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="createdAt">Sort by Created</option>
              <option value="priority">Sort by Priority</option>
            </select>

            <button
              onClick={() => setFilters({})}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Task List or Empty State */}
        {tasksLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600">
              {view === "overdue"
                ? "Great! You have no overdue tasks."
                : "Create your first task to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowTaskForm(true);
                }}
                onDelete={(id) => deleteTaskMutation.mutate(id)}
                onStatusChange={(id, status) =>
                  updateTaskMutation.mutate({ taskId: id, updates: { status } })
                }
              />
            ))}
          </div>
        )}

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            onSubmit={(data) => {
              if (editingTask) {
                updateTaskMutation.mutate({
                  taskId: editingTask.id,
                  updates: data,
                });
              } else {
                createTaskMutation.mutate(data);
              }
            }}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
