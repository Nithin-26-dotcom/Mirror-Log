// controllers/log.controller.js
import Log from "../models/log.model.js";
import Tag from "../models/tag.model.js";
import Page from "../models/page.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// @route POST /api/logs
const createLog = asyncHandler(async (req, res) => {
  const { pageId, content, tagName } = req.body;
  const userId = req.user.id;

  if (!pageId || !content) {
    throw new ApiError(400, "pageId and content are required");
  }

  // check page ownership
  const page = await Page.findOne({ _id: pageId, createdBy: userId });
  if (!page) {
    throw new ApiError(404, "Page not found or not owned by you");
  }

  let tag = null;
  if (tagName) {
    const tagNameLower = tagName.toLowerCase();

    // first check if tag already exists (default or page-specific)
    tag = await Tag.findOne({
      name: tagNameLower,
      $or: [{ isDefault: true }, { pageId }],
    });

    // if not found → create one linked to this page
    if (!tag) {
      tag = await Tag.create({
        name: tagNameLower,
        pageId: pageId,
        isDefault: false,
      });
    }
  } else {
    // fallback: default "note" tag
    tag = await Tag.findOne({ isDefault: true, name: "note" });
    // if (!tag) {
    //   // safety net: if default not present, create one
    //   tag = await Tag.create({
    //     name: "note",
    //     pageId: null,
    //     isDefault: true,
    //   });
    // }
  }

  // create log
  const log = await Log.create({
    user: userId,
    page: pageId,
    content,
    tag: tag._id,
  });

  console.log("page:", pageId);
  return res
    .status(201)
    .json(new ApiResponse(201, log, "Log created successfully"));
});

// @route GET /api/logs
// query: pageId, tagId, topic, from, to
// GET /logs?pageId=&tagId=&search=&from=&to=&pageNum=&limit=
const listLogs = asyncHandler(async (req, res) => {
  const { pageId, tagId, from, to, search } = req.query;
  const q = { user: req.user.id };

  if (pageId) {
    const page = await Page.findOne({ _id: pageId, createdBy: req.user.id });
    if (!page) throw new ApiError(403, "Not authorized to access this page");
    q.page = pageId;
  }

  if (tagId) q.tag = tagId;

  if (search) {
    q.content = { $regex: search, $options: "i" };
  }

  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }

  const pageNum = parseInt(req.query.pageNum) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (pageNum - 1) * limit;

  const [logs, totalCount] = await Promise.all([
    Log.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("tag"),
    Log.countDocuments(q),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { logs, totalCount, pageNum, limit }, "Logs fetched")
    );
});

// GET/ logby id
const getLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await Log.findOne({
    _id: id,
    user: req.user._id, // ensure user owns the log
  })
    .populate("tag", "name") // only fetch tag name
    .populate("page", "title"); // only fetch page title

  if (!log) {
    throw new ApiError(404, "Log not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, log, "Log fetched successfully"));
});

// @route PATCH /api/logs/:id
const updateLog = asyncHandler(async (req, res) => {
  const { content, tagId, topic } = req.body;

  // 1. Find log first (with ownership check)
  const log = await Log.findOne({ _id: req.params.id, user: req.user.id });
  if (!log) throw new ApiError(404, "Log not found");

  // 2. Prepare updates object
  const updates = {};
  if (content !== undefined) updates.content = content;
  if (topic !== undefined) updates.topic = topic;

  // 3. Handle tag validation separately
  if (tagId !== undefined) {
    if (tagId === null) {
      // explicitly remove tag, fallback to default
      let noteTag = await Tag.findOne({ isDefault: true, name: "note" });
      updates.tag = noteTag?._id;
    } else {
      const tag = await Tag.findById(tagId);
      if (!tag) throw new ApiError(400, "Invalid tag");
      if (!tag.isDefault && tag.pageId?.toString() !== log.page.toString()) {
        throw new ApiError(403, "Not allowed to use this tag");
      }
      updates.tag = tag._id;
    }
  }

  // 4. Apply updates and save
  Object.assign(log, updates);
  await log.save();

  return res.status(200).json(new ApiResponse(200, log, "Log updated"));
});

// @route DELETE /api/logs/:id
const deleteLog = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Invalid log id");
  }

  const deleted = await Log.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!deleted) throw new ApiError(404, "Log not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Log deleted successfully"));
});

export { createLog, listLogs, getLogById, updateLog, deleteLog };
