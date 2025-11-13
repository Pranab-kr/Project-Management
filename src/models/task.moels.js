import { Schema, model } from "mongoose";
import { AvailableTaskStatuses } from "../utils/constants.js";

const fileSchema = new Schema({
  url: String,
  localPath: String,
  mimetype: String,
  size: Number,
});

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: AvailableTaskStatuses,
      default: "todo",
    },
    attachments: [fileSchema],
  },
  { timestamps: true }
);

export const Task = model("Task", taskSchema);
