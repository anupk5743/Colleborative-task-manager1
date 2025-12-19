import React from "react";
import type { TaskNotification } from "../types";

interface NotificationCenterProps {
  notifications: TaskNotification[];
  onClose: (id: string) => void;
}

/**
 * Notification Center Component
 * Displays persistent notifications
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.slice(0, 3).map((notif) => (
        <div
          key={notif.id}
          className="bg-blue-500 text-white rounded-lg shadow-lg p-4 pointer-events-auto max-w-sm animate-slide-in"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">Task Assigned!</p>
              <p className="text-sm text-blue-100">{notif.taskTitle}</p>
            </div>
            <button
              onClick={() => onClose(notif.id)}
              className="text-blue-100 hover:text-white ml-4"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
