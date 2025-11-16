import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js ";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.moels.js";
import { asyncHandler } from "../utils/async-handler.js";
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
          url: `/uploads/${file.filename}`,
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

  // Verify that the project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({ project: projectId });

  res
    .status(200)
    .json(new ApiResponce(200, "Project tasks fetched successfully", tasks));
});
