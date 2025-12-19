import React, { useState } from "react";
import type { User, TaskNotification } from "../types";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  notifications: TaskNotification[];
}

/**
 * Navbar Component
 * Navigation and user profile menu
 */
const Navbar: React.FC<NavbarProps> = ({ user, onLogout, notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-indigo-600">Task Manager</h1>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-600 text-center">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50">
                          <p className="font-semibold text-gray-900">
                            Task Assigned
                          </p>
                          <p className="text-sm text-gray-600">
                            {notif.taskTitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.assignedBy}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-gray-900">
                  {user.name}
                </span>
              </button>

              {/* User Menu Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
