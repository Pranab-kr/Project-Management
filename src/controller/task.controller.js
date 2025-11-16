import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js ";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { SubTask } from "../models/subTask.models.js";
import { User } from "../models/user.models.js";

//create task
const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const { title, description, assignedTo, status } = req.body;

  // Verify that the project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Create the task
  const task = new Task({
    title,
    description,
    project: projectId,
    assignedTo,
    status,
    attachments: req.files
      ? req.files.map((file) => ({
          url: `/images/${file.filename}`,
          localPath: file.path,
          mimetype: file.mimetype,
          size: file.size,
        }))
      : [],
  });

  await task.save();

  res.status(201).json(new ApiResponce(201, "Task created successfully", task));
});

//get project tasks
const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({ project: projectId });

  res
    .status(200)
    .json(new ApiResponce(200, "Project tasks fetched successfully", tasks));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponce(200, "Task fetched successfully", task));
});

//update task
const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (assignedTo) task.assignedTo = assignedTo;
  if (status) task.status = status;

  // for file attachments
  if (req.files && req.files.length > 0) {
    const newAttachments = req.files.map((file) => ({
      url: `/images/${file.filename}`,
      localPath: file.path,
      mimetype: file.mimetype,
      size: file.size,
    }));
    task.attachments.push(...newAttachments);
  }

  await task.save();

  res.status(200).json(new ApiResponce(200, "Task updated successfully", task));
});

//delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await task.deleteOne();

  res.status(200).json(new ApiResponce(200, "Task deleted successfully"));
});

//subtask controllers
//create subtask
const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, isCompleted } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = new SubTask({
    title,
    isCompleted,
    task: taskId,
  });

  await subTask.save();

  res
    .status(201)
    .json(new ApiResponce(201, "Subtask created successfully", subTask));
});

//update subtask
const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId, subTaskId } = req.params;
  const { title, isCompleted, userId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId, task: taskId });
  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  if (title) subTask.title = title;
  if (isCompleted !== undefined) subTask.isCompleted = isCompleted;
  if (userId) subTask.completedBy = userId;

  await subTask.save();

  res
    .status(200)
    .json(new ApiResponce(200, "Subtask updated successfully", subTask));
});

//delete subtask
const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId, subTaskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = await SubTask.findOne({ _id: subTaskId, task: taskId });
  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  await subTask.deleteOne();

  res.status(200).json(new ApiResponce(200, "Subtask deleted successfully"));
});

export {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
};
