// controllers/roadmap.controller.js
import Roadmap from "../models/roadmap.model.js";
import Page from "../models/page.model.js";
import Todo from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Ownership guard
const ensurePageOwner = async (pageId, userId) => {
  const page = await Page.findOne({ _id: pageId, createdBy: userId });
  if (!page) throw new ApiError(404, "Page not found or not authorized");
  return page;
};

// @route POST /api/roadmaps
export const createRoadmap = asyncHandler(async (req, res) => {
  const { pageId, startDate, endDate, isRecurring, subheadings } = req.body;
  if (!pageId) throw new ApiError(400, "pageId is required");

  await ensurePageOwner(pageId, req.user._id);

  const roadmap = await Roadmap.create({
    pageId,
    startDate,
    endDate,
    isRecurring: !!isRecurring,
    subheadings: Array.isArray(subheadings) ? subheadings : [],
  });

  return res.status(201).json(new ApiResponse(201, roadmap, "Roadmap created"));
});

// @route GET /api/roadmaps/by-page/:pageId
export const getByPage = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  await ensurePageOwner(pageId, req.user._id);
  const roadmap = await Roadmap.findOne({ pageId }).populate(
    "subheadings.todos"
  );
  if (!roadmap) throw new ApiError(404, "No roadmap found for this page");
  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap fetched"));
});

// @route PATCH /api/roadmaps/:id
export const updateRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  const { startDate, endDate, isRecurring, subheadings } = req.body;
  if (startDate !== undefined) roadmap.startDate = startDate;
  if (endDate !== undefined) roadmap.endDate = endDate;
  if (isRecurring !== undefined) roadmap.isRecurring = !!isRecurring;
  if (Array.isArray(subheadings)) roadmap.subheadings = subheadings;

  await roadmap.save();
  return res.status(200).json(new ApiResponse(200, roadmap, "Roadmap updated"));
});

// @route DELETE /api/roadmaps/:id
export const deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  await Roadmap.deleteOne({ _id: roadmap._id });
  return res.status(200).json(new ApiResponse(200, null, "Roadmap deleted"));
});

/** --- TODO helpers inside roadmap --- **/

// @route POST /api/roadmaps/:id/subheadings
export const addSubheading = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  const { title } = req.body;
  if (!title) throw new ApiError(400, "title is required");

  roadmap.subheadings.push({ title, todos: [] });
  await roadmap.save();

  return res
    .status(201)
    .json(new ApiResponse(201, roadmap, "Subheading added"));
});

// @route POST /api/roadmaps/:id/subheadings/:idx/todos
export const addTodo = asyncHandler(async (req, res) => {
  const { id, idx } = req.params;
  const { content } = req.body;
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  if (roadmap.subheadings[+idx] == null)
    throw new ApiError(400, "Invalid subheading index");
  if (!content) throw new ApiError(400, "content is required");

  const todo = await Todo.create({ content, isCompleted: false });
  roadmap.subheadings[+idx].todos.push(todo._id);
  await roadmap.save();

  return res.status(201).json(new ApiResponse(201, todo, "Todo added"));
});

// @route PATCH /api/roadmaps/:id/subheadings/:idx/todos/:todoId
export const toggleTodo = asyncHandler(async (req, res) => {
  const { id, idx, todoId } = req.params;
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  const todo = await Todo.findById(todoId);
  if (!todo) throw new ApiError(404, "Todo not found");
  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  return res.status(200).json(new ApiResponse(200, todo, "Todo toggled"));
});

// @route DELETE /api/roadmaps/:id/subheadings/:idx/todos/:todoId
export const removeTodo = asyncHandler(async (req, res) => {
  const { id, idx, todoId } = req.params;
  const roadmap = await Roadmap.findById(id);
  if (!roadmap) throw new ApiError(404, "Roadmap not found");
  await ensurePageOwner(roadmap.pageId, req.user._id);

  const sh = roadmap.subheadings[+idx];
  if (!sh) throw new ApiError(400, "Invalid subheading index");

  const pos = sh.todos.findIndex((t) => t.toString() === todoId);
  if (pos === -1) throw new ApiError(404, "Todo not linked in this subheading");

  sh.todos.splice(pos, 1);
  await roadmap.save();
  await Todo.findByIdAndDelete(todoId);

  return res.status(200).json(new ApiResponse(200, null, "Todo removed"));
});
