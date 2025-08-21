// controllers/log.controller.js
import Log from "../models/log.model.js";
import Tag from "../models/tag.model.js";
import Page from "../models/page.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route POST /api/logs
const createLog = asyncHandler(async (req, res) => {
  const { pageId, content, tagId } = req.body;
  const userId = req.user._id;

  if (!pageId || !content) {
    throw new ApiError(400, "pageId and content are required");
  }

  // check page ownership
  const page = await Page.findOne({ _id: pageId, user: userId });
  if (!page) {
    throw new ApiError(404, "Page not found or not owned by you");
  }

  // optional: validate tag belongs to this page or is default
  if (tagId) {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new ApiError(404, "Tag not found");
    if (!tag.isDefault && tag.page?.toString() !== pageId.toString()) {
      throw new ApiError(403, "You cannot use this tag");
    }
  } else {
    tagId = await Tag.findOne({ isDefault: true, name: "note" });
  }

  // create log
  const log = await Log.create({
    user: userId,
    page: pageId,
    content,
    tag: tagId || null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, log, "Log created successfully"));
});

// @route GET /api/logs
// query: pageId, tagId, topic, from, to
export const listLogs = asyncHandler(async (req, res) => {
  const { pageId, tagId, topic, from, to } = req.query;
  const q = { user: req.user._id };

  if (pageId) q.page = pageId;
  if (tagId) q.tag = tagId;
  if (topic) q.topic = topic;
  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }

  const logs = await Log.find(q).sort({ createdAt: -1 }).populate("tag");
  return res.status(200).json(new ApiResponse(200, logs, "Logs fetched"));
});

// @route PATCH /api/logs/:id
export const updateLog = asyncHandler(async (req, res) => {
  const log = await Log.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new ApiError(404, "Log not found");

  const { content, tagId, topic } = req.body;
  if (content !== undefined) log.content = content;
  if (topic !== undefined) log.topic = topic;

  if (tagId !== undefined) {
    if (tagId === null) {
      log.tag = null;
    } else {
      const tag = await Tag.findById(tagId);
      if (!tag) throw new ApiError(400, "Invalid tag");
      if (
        !tag.isDefault &&
        tag.userId?.toString() !== req.user._id.toString() &&
        tag.pageId?.toString() !== log.page?.toString()
      ) {
        throw new ApiError(403, "Not allowed to use this tag");
      }
      log.tag = tag._id;
    }
  }

  await log.save();
  return res.status(200).json(new ApiResponse(200, log, "Log updated"));
});

// @route DELETE /api/logs/:id
export const deleteLog = asyncHandler(async (req, res) => {
  const deleted = await Log.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!deleted) throw new ApiError(404, "Log not found");
  return res.status(200).json(new ApiResponse(200, null, "Log deleted"));
});
