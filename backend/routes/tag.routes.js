import {
  createTag,
  listTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createTag); // Create a new custom tag
router.get("/:pageId", verifyJWT, listTags); // List tags for a given page
router.get("/tag/:id", verifyJWT, getTagById); // Get a single tag by ID
router.patch("/:id", verifyJWT, updateTag); // Update a tag (non-default only)
router.delete("/:id", verifyJWT, deleteTag); // Delete a tag (non-default only)

export default router;
