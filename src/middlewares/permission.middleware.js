import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.models.js";

// Check if user is project owner (admin)
export const isProjectAdmin = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project admin can perform this action");
  }

  req.project = project;
  next();
});

// Check if user is project admin or project_admin role
export const canManageProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );
  const isProjectAdmin = member?.role === "project_admin";

  if (!isOwner && !isProjectAdmin) {
    throw new ApiError(403, "You don't have permission to manage this project");
  }

  req.project = project;
  next();
});

// Check if user is a member of the project
export const isProjectMember = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  const isMember = project.members.some(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!isOwner && !isMember) {
    throw new ApiError(403, "You are not a member of this project");
  }

  req.project = project;
  next();
});
