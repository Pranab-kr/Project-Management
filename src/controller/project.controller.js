import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";

// Create project
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Project name is required");
  }

  const project = await Project.create({
    name,
    description,
    owner: req.user._id,
    members: [],
  });

  return res
    .status(201)
    .json(new ApiResponce(201, project, "Project created successfully"));
});

// Get user projects
const getUserProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
  })
    .populate("owner", "username email avatar")
    .select("-__v");

  const projectsWithMemberCount = projects.map((project) => ({
    ...project.toObject(),
    memberCount: project.members.length,
  }));

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        projectsWithMemberCount,
        "Projects fetched successfully",
      ),
    );
});

// TODO: Implement remaining controllers
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate("owner", "username email avatar")
    .populate("members.user", "username email avatar")
    .select("-__v");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, project, "Project fetched successfully"));


});

const updateProject = asyncHandler(async (req, res) => {
  // Implementation needed
});

const deleteProject = asyncHandler(async (req, res) => {
  // Implementation needed
});

const addMember = asyncHandler(async (req, res) => {
  // Implementation needed
});

const getProjectMembers = asyncHandler(async (req, res) => {
  // Implementation needed
});

const updateMemberRole = asyncHandler(async (req, res) => {
  // Implementation needed
});

const removeMember = asyncHandler(async (req, res) => {
  // Implementation needed
});

export {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
  updateMemberRole,
  removeMember,
};
