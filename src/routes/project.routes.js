import { Router } from "express";
import { ensureAuth } from "../middlewares/auth.middleware.js";
import {
  isProjectAdmin,
  isProjectMember,
} from "../middlewares/permission.middleware.js";
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
  updateMemberRole,
  removeMember,
} from "../controller/project.controller.js";

const router = Router();

// All routes require authentication
router.use(ensureAuth);

router.post("/", createProject);
router.get("/", getUserProjects);
router.get("/:projectId", isProjectMember, getProjectById);
router.put("/:projectId", isProjectAdmin, updateProject);
router.delete("/:projectId", isProjectAdmin, deleteProject);

// Member management routes
router.get("/:projectId/members", isProjectMember, getProjectMembers);
router.post("/:projectId/members", isProjectAdmin, addMember);
router.put("/:projectId/members/:userId", isProjectAdmin, updateMemberRole);
router.delete("/:projectId/members/:userId", isProjectAdmin, removeMember);

export default router;
