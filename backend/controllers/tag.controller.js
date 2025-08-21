// controllers/tag.controller.js
import Tag from "../models/tag.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Page from "../models/page.model.js";

// @route POST /api/tags (custom tag)
const createTag = asyncHandler(async (req, res) => {
  const { name, pageId, isDefault } = req.body;
  if (!name) throw new ApiError(400, "name is required");

  let pageRef = null;

  if (pageId) {
    const page = await Page.findOne({ _id: pageId, createdBy: req.user._id });
    if (!page) throw new ApiError(404, "Page not found or not authorized");
    pageRef = page._id;
  }

  if (isDefault && pageRef) {
    throw new ApiError(400, "Default tags cannot be tied to a specific page.");
  }
  if (isDefault && req.body.user.role !== "admin") {
    throw new ApiError(403, "Only admins can create default tags.");
  }

  if (!isDefault && !pageRef) {
    throw new ApiError(400, "Custom tags must be associated with a page.");
  }

  // prevent duplicates (for both default + custom)
  const exists = await Tag.findOne({
    name,
    pageId: pageRef, // for default, this will be null
  });
  if (exists) throw new ApiError(409, "Tag already exists");

  const tag = await Tag.create({
    name,
    isDefault,
    pageId: pageRef,
  });

  return res.status(201).json(new ApiResponse(201, tag, "Tag created"));
});

// @route GET /api/tags (list all tags visible to user; optional pageId filter)
const listTags = asyncHandler(async (req, res) => {
  const { pageId } = req.params;

  if (!pageId) throw new ApiError(400, "pageId is required");

  const pageobj = await Page.findOne({
    _id: pageId,
    createdBy: req.user._id,
  });
  if (!pageobj) throw new ApiError(404, "Page not found or not authorized");

  const tags = await Tag.find({
    $or: [{ isDefault: true }, { pageId: pageId }],
  }).sort({ isDefault: -1, name: 1 });

  return res.status(200).json(new ApiResponse(200, tags, "Tags fetched"));
});

// @route PATCH /api/tags/:id
const updateTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) throw new ApiError(404, "Tag not found");

  if (tag.isDefault) {
    throw new ApiError(403, "Cannot modify default tag");
  }

  const page = await Page.findOne({ _id: tag.pageId });

  if (page.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  const { name, color } = req.body;

  if (name) tag.name = name;
  // if (color) tag.color = color; // optional field for later

  await tag.save();

  return res.status(200).json(new ApiResponse(200, tag, "Tag updated"));
});

// @route DELETE /api/tags/:id
const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) throw new ApiError(404, "Tag not found");

  // prevent accidental deletion of system tags
  if (tag.isDefault) throw new ApiError(403, "Cannot delete default tag");

  const page = await Page.findOne({ _id: tag.pageId });

  if (page.createdBy?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  await Tag.deleteOne({ _id: tag._id });

  return res.status(200).json(new ApiResponse(200, null, "Tag deleted"));
});

export { createTag, listTags, updateTag, deleteTag };
