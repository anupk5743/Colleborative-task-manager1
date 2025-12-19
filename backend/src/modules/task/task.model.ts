import mongoose, { Schema, Document } from "mongoose";

/**
 * Task Document Interface
 * Defines the structure of a task in the database
 */
export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: mongoose.Types.ObjectId;
  assignedToId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Urgent"],
        message: "Priority must be Low, Medium, High, or Urgent",
      },
      default: "Medium",
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Review", "Completed"],
        message: "Status must be To Do, In Progress, Review, or Completed",
      },
      default: "To Do",
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taskSchema.index({ creatorId: 1 });
taskSchema.index({ assignedToId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;