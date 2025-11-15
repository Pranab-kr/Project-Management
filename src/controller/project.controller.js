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

// Get project by ID
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

//update project controller by id
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // if (project.owner.toString() !== req.user._id.toString()) {
  //   throw new ApiError(403, "You are not authorized to update this project");
  // }

  project.name = name || project.name;
  project.description = description || project.description;

  await project.save();

  return res
    .status(200)
    .json(new ApiResponce(200, project, "Project updated successfully"));
});

//delete project controller by id
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await project.remove();

  return res
    .status(200)
    .json(new ApiResponce(200, null, "Project deleted successfully"));
});

//add member to project controller
const addMember = asyncHandler(async (req, res) => {
  const {projectId} = req.params;
  const {userId, role} = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isAlreadyMember = project.members.some(
    (member) => member.user.toString() === userId
  );
  if (isAlreadyMember) {
    throw new ApiError(400, "User is already a member of the project");
  }

  project.members.push({ user: userId, role: role || "member" });
  await project.save();

  return res
    .status(200)
    .json(new ApiResponce(200, project, "Member added successfully"));
});

//get project members controller
const getProjectMembers = asyncHandler(async (req, res) => {
  const {projectId} = req.params;

  const project = await Project.findById(projectId).populate(
    "members.user",
    "username email avatar"
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        project.members,
        "Project members fetched successfully",
      ),
    );
});

//update member role controller
const updateMemberRole = asyncHandler(async (req, res) => {
  const {projectId, userId} = req.params;
  const {role} = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const member = project.members.find(
    (member) => member.user.toString() === userId
  );
  if (!member) {
    throw new ApiError(404, "Member not found in the project");
  }

  member.role = role || member.role;
  await project.save();

  return res
    .status(200)
    .json(new ApiResponce(200, project, "Member role updated successfully"));
});

//remove member from project controller
const removeMember = asyncHandler(async (req, res) => {
  const {projectId, userId} = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const memberIndex = project.members.findIndex(
    (member) => member.user.toString() === userId
  );
  if (memberIndex === -1) {
    throw new ApiError(404, "Member not found in the project");
  }

  project.members.splice(memberIndex, 1);
  await project.save();

  return res
    .status(200)
    .json(new ApiResponce(200, project, "Member removed successfully"));
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
