import { Router } from "express";
import { authMiddleware, ensureAuth } from "../middlewares/auth.middleware.js";
import {
  isProjectMember,
  isProjectAdmin,
} from "../middlewares/permission.middleware.js";
import {
  createNote,
  getProjectNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controller/note.controller.js";

const router = Router();

router.use(ensureAuth);

// Note routes
router.post("/:projectId", isProjectAdmin, createNote);
router.get("/:projectId", isProjectMember, getProjectNotes);
router.get("/:projectId/n/:noteId", isProjectMember, getNoteById);
router.patch("/:projectId/n/:noteId", isProjectAdmin, updateNote);
router.delete("/:projectId/n/:noteId", isProjectAdmin, deleteNote);

export default router;
