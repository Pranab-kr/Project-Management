import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponce } from "../utils/api-responce.js";
import { Note } from "../models/note.models.js";
import { Project } from "../models/project.models.js";

//note controller start here
// Create note
const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const note = await Note.create({
    title,
    content,
    project: projectId,
    createdBy: req.user._id,
  });

  const populatedNote = await Note.findById(note._id)
    .populate("createdBy", "username email avatar")
    .populate("project", "name");

  return res
    .status(201)
    .json(new ApiResponce(201, populatedNote, "Note created successfully"));
});

// Get all notes for a project
const getProjectNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const notes = await Note.find({ project: projectId })
    .populate("createdBy", "username email avatar")
    .populate("project", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponce(200, notes, "Notes fetched successfully"));
});

// Get note by ID
const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId)
    .populate("createdBy", "username email avatar")
    .populate("project", "name");

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, note, "Note fetched successfully"));
});

// Update note
const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Update fields
  if (title) note.title = title;
  if (content) note.content = content;

  await note.save();

  const updatedNote = await Note.findById(noteId)
    .populate("createdBy", "username email avatar")
    .populate("project", "name");

  return res
    .status(200)
    .json(new ApiResponce(200, updatedNote, "Note updated successfully"));
});

// Delete note
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  await note.deleteOne();

  return res
    .status(200)
    .json(new ApiResponce(200, {}, "Note deleted successfully"));
});

export { createNote, getProjectNotes, getNoteById, updateNote, deleteNote };
