import { Router } from "express";
import { authMiddleware, ensureAuth } from "../middlewares/auth.middleware.js";
import {
  isProjectMember,
  canManageProject,
} from "../middlewares/permission.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controller/task.controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware, ensureAuth);

// Task routes
router.post(
  "/:projectId",
  canManageProject,
  upload.array("attachments", 5),
  createTask,
);
router.get("/:projectId", isProjectMember, getProjectTasks);

router.get("/:projectId/t/:taskId", isProjectMember, getTaskById);

router.put(
  "/:projectId/t/:taskId",
  canManageProject,
  upload.array("attachments", 5),
  updateTask,
);

router.delete("/:projectId/t/:taskId", canManageProject, deleteTask);

// Subtask routes
router.post("/:projectId/t/:taskId/subtasks", canManageProject, createSubTask);
router.put("/:projectId/st/:subTaskId", isProjectMember, updateSubTask);
router.delete("/:projectId/st/:subTaskId", canManageProject, deleteSubTask);

export default router;
