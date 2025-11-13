import { Schema, model } from "mongoose";
import { AvailableUserRoles } from "../utils/constants.js";

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

export const Project = model("Project", projectSchema);
