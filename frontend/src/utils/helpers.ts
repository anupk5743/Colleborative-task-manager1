/**
 * Utility function to format date
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Utility function to format time
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Utility function to format datetime
 */
export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dueDate: Date | string): boolean => {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

/**
 * Check if date is today
 */
export const isToday = (dueDate: Date | string): boolean => {
  return new Date(dueDate).toDateString() === new Date().toDateString();
};

/**
 * Check if date is in the future
 */
export const isFuture = (dueDate: Date | string): boolean => {
  return new Date(dueDate) > new Date();
};

/**
 * Get days until date
 */
export const daysUntil = (dueDate: Date | string): number => {
  const today = new Date();
  const future = new Date(dueDate);
  const timeDiff = future.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "bg-blue-100 text-blue-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "High":
      return "bg-orange-100 text-orange-800";
    case "Urgent":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Get status color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "To Do":
      return "bg-gray-100 text-gray-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Review":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
