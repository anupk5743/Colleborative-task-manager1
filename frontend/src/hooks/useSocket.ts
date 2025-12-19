import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { TaskNotification } from "../types";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5001";

interface UseSocketReturn {
  isConnected: boolean;
  error: string | null;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
  emit: (event: string, data: any) => void;
  notifications: TaskNotification[];
}

/**
 * Custom hook for Socket.io real-time communication
 * Manages WebSocket connection, event subscriptions, and notifications
 */
export const useSocket = (token: string | null): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);

  useEffect(() => {
    // Only connect if token is available
    if (!token) {
      return;
    }

    try {
      // Initialize Socket.io connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      /**
       * Connection events
       */
      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        setError(null);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (error: any) => {
        console.error("Socket connection error:", error);
        setError(error.message);
      });

      /**
       * Task notification events
       */
      socketRef.current.on(
        "notification:taskAssigned",
        (data: TaskNotification) => {
          console.log("Task assigned notification:", data);
          setNotifications((prev) => [
            {
              ...data,
              id: Math.random().toString(),
              type: "info",
              read: false,
            },
            ...prev,
          ]);
        }
      );

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    } catch (err: any) {
      console.error("Socket initialization error:", err);
      setError(err.message);
    }
  }, [token]);

  /**
   * Subscribe to an event
   */
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  /**
   * Unsubscribe from an event
   */
  const unsubscribe = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  /**
   * Emit an event
   */
  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
    emit,
    notifications,
  };
};

