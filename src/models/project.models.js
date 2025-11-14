import { Schema, model } from "mongoose";
import { AvailableUserRoles } from "../utils/constants.js";
import { Task } from "./task.models.js";
import { Note } from "./note.models.js";
import { SubTask } from "./subtask.models.js";

const projectMemberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: AvailableUserRoles,
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [projectMemberSchema],
  },
  { timestamps: true }
);

projectSchema.pre("remove", async function (next) {
  const projectId = this._id;

  await Task.deleteMany({ project: projectId });
  await Note.deleteMany({ project: projectId });
  // Also delete subtasks if needed:
  await SubTask.deleteMany({ task: { $in: tasksIds } });

  next();
});


export const Project = model("Project", projectSchema);
