import React from "react";
import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

/**
 * Task List Component
 * Displays list of tasks
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {task.description.substring(0, 100)}...
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
