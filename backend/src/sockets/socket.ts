import { Server } from "socket.io";
import { authService } from "../modules/auth/auth.service";
import { Server as HTTPServer } from "http";

let io: Server;

// Store online users
const onlineUsers: Map<string, string> = new Map(); // userId -> socketId

/**
 * Initialize Socket.io for real-time collaboration
 * Handles live task updates and notifications
 */
export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = authService.verifyToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    console.log(`User connected: ${socket.id} (userId: ${userId})`);

    // Store user in online map
    onlineUsers.set(userId, socket.id);

    // Notify others that user is online
    socket.broadcast.emit("user:online", { userId });

    /**
     * Task Update Events
     */

    // Listen for task status updates
    socket.on("task:statusChanged", (data) => {
      // Broadcast to all connected clients
      io.emit("task:statusChanged", {
        taskId: data.taskId,
        newStatus: data.newStatus,
        updatedBy: userId,
        timestamp: new Date(),
      });

      console.log(`Task ${data.taskId} status changed to ${data.newStatus}`);
    });

    // Listen for task priority updates
    socket.on("task:priorityChanged", (data) => {
      io.emit("task:priorityChanged", {
        taskId: data.taskId,
        newPriority: data.newPriority,
        updatedBy: userId,
        timestamp: new Date(),
      });

      console.log(`Task ${data.taskId} priority changed to ${data.newPriority}`);
    });

    // Listen for task assignment
    socket.on("task:assigned", (data) => {
      const assignedToId = data.assignedToId;
      const assignedSocketId = onlineUsers.get(assignedToId);

      // Send notification to assigned user if online
      if (assignedSocketId) {
        io.to(assignedSocketId).emit("notification:taskAssigned", {
          taskId: data.taskId,
          taskTitle: data.taskTitle,
          assignedBy: data.assignedBy,
          timestamp: new Date(),
        });

        console.log(
          `Task ${data.taskId} assigned to user ${assignedToId} - notification sent`
        );
      }

      // Broadcast task update to all
      io.emit("task:assigned", {
        taskId: data.taskId,
        assignedToId,
        updatedBy: userId,
        timestamp: new Date(),
      });
    });

    // Listen for task creation
    socket.on("task:created", (data) => {
      io.emit("task:created", {
        ...data,
        createdBy: userId,
        timestamp: new Date(),
      });

      console.log(`New task created: ${data.taskId}`);
    });

    // Listen for task deletion
    socket.on("task:deleted", (data) => {
      io.emit("task:deleted", {
        taskId: data.taskId,
        deletedBy: userId,
        timestamp: new Date(),
      });

      console.log(`Task ${data.taskId} deleted`);
    });

    /**
     * Disconnect event
     */
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user:offline", { userId });
      console.log(`User disconnected: ${socket.id} (userId: ${userId})`);
    });
  });
};

/**
 * Emit task update to all connected clients
 * Can be called from API endpoints
 */
export const emitTaskUpdate = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};

export { io };

