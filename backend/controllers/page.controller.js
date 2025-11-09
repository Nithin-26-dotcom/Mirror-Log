// controllers/page.controller.js
import Page from "../models/page.model.js";
import Roadmap from "../models/roadmap.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route POST /api/pages
const createPage = asyncHandler(async (req, res) => {
  const { title, description, topicTags } = req.body;
  if (!title) throw new ApiError(400, "title is required");

  if (description && typeof description !== "string") {
    throw new ApiError(400, "description must be a string");
  }
  if (topicTags && !Array.isArray(topicTags)) {
    throw new ApiError(400, "topicTags must be an array");
  }

  // Check for duplicate page title for this user (case-insensitive)
  const existingPage = await Page.findOne({
    createdBy: req.user._id,
    title: { $regex: new RegExp(`^${title.trim()}$`, "i") }, // Case-insensitive match
  });

  if (existingPage) {
    throw new ApiError(409, `A page with the title "${title}" already exists. Please choose a different name.`);
  }

  const page = await Page.create({
    createdBy: req.user._id,
    title: title.trim(),
    description,
    topicTags: Array.isArray(topicTags) ? topicTags : [],
  });

  // Automatically create an empty roadmap for this page
  await Roadmap.create({
    pageId: page._id,
    subheadings: [],
  });

  return res.status(201).json(new ApiResponse(201, page, "Page created"));
});

// @route GET /api/pages
const listMyPages = asyncHandler(async (req, res) => {
  const pages = await Page.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json(new ApiResponse(200, pages, "Pages fetched"));
});

// @route GET /api/pages/:id
const getPageById = asyncHandler(async (req, res) => {
  console.log(req.user);
  console.log(req.user.id);
  const page = await Page.findOne({
    _id: req.params.pageId,
    createdBy: req.user.id,
  });
  if (!page) throw new ApiError(404, "Page not found or not authorized");
  return res.status(200).json(new ApiResponse(200, page, "Page fetched"));
});

// @route PATCH /api/pages/:id
const updatePage = asyncHandler(async (req, res) => {
  const { title, description, topicTags } = req.body;
  const page = await Page.findOne({
    _id: req.params.pageId,
    createdBy: req.user._id,
  });
  if (!page) throw new ApiError(404, "Page not found or not authorized");

  // Check for duplicate page title if title is being updated
  if (title != null && title.trim() !== page.title) {
    const existingPage = await Page.findOne({
      createdBy: req.user._id,
      _id: { $ne: req.params.pageId }, // Exclude current page
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") }, // Case-insensitive match
    });

    if (existingPage) {
      throw new ApiError(409, `A page with the title "${title}" already exists. Please choose a different name.`);
    }
    page.title = title.trim();
  }
  if (description != null) page.description = description;
  if (Array.isArray(topicTags)) page.topicTags = topicTags;

  await page.save();
  return res.status(200).json(new ApiResponse(200, page, "Page updated"));
});

// @route DELETE /api/pages/:id
const deletePage = asyncHandler(async (req, res) => {
  const deleted = await Page.findOneAndDelete({
    _id: req.params.pageId,
    createdBy: req.user._id,
  });
  if (!deleted) throw new ApiError(404, "Page not found or not authorized");
  return res.status(200).json(new ApiResponse(200, null, "Page deleted"));
});

export { createPage, listMyPages, getPageById, updatePage, deletePage };
