import React from "react";
import type { Task } from "../types";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  isOverdue,
} from "../utils/helpers";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

/**
 * Task Card Component
 * Displays a single task with actions
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const overdueClass = isOverdue(task.dueDate)
    ? "border-l-4 border-red-500"
    : "";

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition ${overdueClass}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold"
        >
          Delete
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      {/* Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* Due Date */}
      <div className="mb-4 text-sm">
        <p className="text-gray-500">
          Due:{" "}
          <span className={isOverdue(task.dueDate) ? "text-red-600 font-bold" : ""}>
            {formatDate(task.dueDate)}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          Edit
        </button>
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as Task["status"])
          }
          className="flex-1 border border-gray-300 rounded px-3 py-2 font-semibold"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
