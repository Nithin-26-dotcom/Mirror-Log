import Roadmap from "../models/roadmap.model.js";
import Todo from "../models/todo.model.js";
import Page from "../models/page.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ---------------- ROADMAP ----------------

// Create a roadmap
export const createRoadmap = asyncHandler(async (req, res) => {
  const { pageId, subheadings } = req.body;

  if (!pageId) {
    throw new ApiError(400, "pageId is required");
  }

  // Check if page exists and belongs to user
  const page = await Page.findOne({ _id: pageId, createdBy: req.user._id });
  if (!page) {
    throw new ApiError(404, "Page not found or not owned by you");
  }

  // Check if roadmap already exists for this page
  const existingRoadmap = await Roadmap.findOne({ pageId });
  if (existingRoadmap) {
    throw new ApiError(409, "Roadmap already exists for this page");
  }

  const processedSubheadings = await Promise.all(
    (subheadings || []).map(async (sub) => {
      const todosToCreate = (sub.todos || []).map((todo) => ({
        content: typeof todo === "string" ? todo : todo.content || todo.text || "",
        isCompleted: todo.isCompleted || false,
      })).filter((todo) => todo.content.trim());

      const createdTodos = todosToCreate.length > 0 
        ? await Todo.insertMany(todosToCreate)
        : [];
      
      return {
        title: sub.title || `Week ${Date.now()}`,
        todos: createdTodos.map((t) => t._id),
      };
    })
  );

  const roadmap = await Roadmap.create({
    pageId,
    subheadings: processedSubheadings,
  });

  const populatedRoadmap = await Roadmap.findById(roadmap._id).populate(
    "subheadings.todos"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedRoadmap, "Roadmap created successfully"));
});

// Get roadmap by pageId (auto-create if missing)
export const getRoadmapByPage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  // Verify page ownership
  const page = await Page.findOne({ _id: pageId, createdBy: req.user._id });
  if (!page) {
    throw new ApiError(404, "Page not found or not authorized");
  }

  let roadmap = await Roadmap.findOne({ pageId }).populate(
    "subheadings.todos"
  );

  // Auto-create empty roadmap if it doesn't exist (for backwards compatibility)
  if (!roadmap) {
    roadmap = await Roadmap.create({
      pageId,
      subheadings: [],
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, roadmap, "Roadmap fetched successfully"));
});

// Update roadmap (like adding subheadings etc.)
export const updateRoadmap = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;
  const { subheadings } = req.body;

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  // Verify page ownership
  const page = await Page.findOne({ _id: roadmap.pageId, createdBy: req.user._id });
  if (!page) {
    throw new ApiError(403, "Not authorized to update this roadmap");
  }

  // Process subheadings - ensure todos are ObjectIds
  const processedSubheadings = (subheadings || []).map((sub) => ({
    title: sub.title || "",
    todos: Array.isArray(sub.todos) 
      ? sub.todos.map(todo => typeof todo === 'string' ? todo : todo._id || todo)
      : []
  }));

  roadmap.subheadings = processedSubheadings;
  await roadmap.save();

  const populatedRoadmap = await Roadmap.findById(roadmap._id).populate(
    "subheadings.todos"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedRoadmap, "Roadmap updated successfully"));
});

// Delete roadmap
export const deleteRoadmap = asyncHandler(async (req, res) => {
  const { roadmapId } = req.params;

  const roadmap = await Roadmap.findByIdAndDelete(roadmapId);

  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Roadmap deleted successfully"));
});

// ---------------- TODOS ----------------

// Add todo under a subheading
export const addTodo = asyncHandler(async (req, res) => {
  const { roadmapId, subheadingIndex } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Todo content is required");
  }

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  if (subheadingIndex < 0 || subheadingIndex >= roadmap.subheadings.length) {
    throw new ApiError(400, "Invalid subheading index");
  }

  const todo = await Todo.create({ content });
  roadmap.subheadings[subheadingIndex].todos.push(todo._id);
  await roadmap.save();

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo added successfully"));
});

// Toggle todo completion
export const toggleTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId);
  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo status updated"));
});

// Delete a todo
export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId, roadmapId, subheadingIndex } = req.params;

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) {
    throw new ApiError(404, "Roadmap not found");
  }

  roadmap.subheadings[subheadingIndex].todos = roadmap.subheadings[
    subheadingIndex
  ].todos.filter((id) => id.toString() !== todoId);

  await roadmap.save();
  await Todo.findByIdAndDelete(todoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Todo deleted successfully"));
});
